# SCOPE

## Anomaly Log
During the ingestion of the CSV data, the following data problems (anomalies) were identified:

1. **Messy Dates:**
   - **Problem:** Several rows have `########` instead of dates (likely due to a copy-paste from Excel with narrow columns). Others have inconsistent formats like `14-Mar`, `15/03/202` (truncated year), and ambiguous `4/5/2026` (as noted by a user: "is this April 5 or May 4?").
   - **Handling:** Created a date parser that infers the closest logical date based on surrounding rows if the date is missing/invalid (`########`). For `14-Mar`, it assumes the current context year. Truncated years like `202` are padded to `2026`. Ambiguous dates log a warning but default to DD/MM/YYYY.
   
2. **Inconsistent Names (Case Sensitivity & Typos):**
   - **Problem:** `paid_by` has "priya", "Priya", "Priya S", "rohan", "Rohan".
   - **Handling:** Sanitized names by trimming whitespace, removing single-letter initials (like " S" in Priya S), and capitalizing the first letter (e.g. "rohan" -> "Rohan").
   
3. **Missing "Paid By" Information:**
   - **Problem:** "House cleaning suppli" has no `paid_by` (blank), with a note "can't remember who paid".
   - **Handling:** Added as "Unknown" and skipped from balance calculation but included in total group expenses. 
   
4. **Invalid / Extreme Amounts:**
   - **Problem:** Cylinder amount is `899.995`. A "Dinner ord" amount is `0` ("counted twice earlier - fixing later"). "Parasailing" has a negative amount `-30` ("one slot got cancelled").
   - **Handling:** Rounded decimals to 2 places. Ignored/skipped rows where amount is `0` or less than `0` (negative amounts are logged as refunds/adjustments and excluded from normal expense tracking).
   
5. **Settlements Mixed with Expenses:**
   - **Problem:** "Rohan paid" 5000 is a settlement ("this is a settlement not an expense??") and has empty `split_type`.
   - **Handling:** Extracted these rows into a separate `settlements` log rather than regular expenses so it accurately reflects balances.
   
6. **Mismatched Split Percentages:**
   - **Problem:** "Weekend b" split is Aisha 30%; Rohan 30%; Priya 30%; Meera 20% (Total = 110%).
   - **Handling:** Normalizes the percentages to sum to 100% (e.g., 30/110) and logs a warning in the import report.
   
7. **Different Currencies:**
   - **Problem:** Some expenses are in USD.
   - **Handling:** Applied a static conversion rate (e.g., 1 USD = 83 INR) to calculate everything in INR.

## Database Schema (Proposed)
Though the app uses local state, if this were to be persisted to a database, the schema would look like this:

**Users Table:**
- `id` (UUID, PK)
- `name` (String)

**Expenses Table:**
- `id` (UUID, PK)
- `date` (Date)
- `description` (String)
- `paid_by_id` (UUID, FK to Users)
- `amount` (Decimal)
- `currency` (String)
- `original_amount` (Decimal) 
- `notes` (String)

**Expense_Splits Table:**
- `id` (UUID, PK)
- `expense_id` (UUID, FK to Expenses)
- `user_id` (UUID, FK to Users)
- `amount_owed` (Decimal)
- `split_type` (Enum: EQUAL, EXACT, PERCENTAGE, SHARE)

**Settlements Table:**
- `id` (UUID, PK)
- `date` (Date)
- `payer_id` (UUID, FK to Users)
- `payee_id` (UUID, FK to Users)
- `amount` (Decimal)
