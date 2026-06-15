# Decision Log

## 1. Handling Missing / Messy Dates (`########`)
- **Options Considered:**
  1. Throw an error and refuse to import the row.
  2. Prompt the user to fix it manually in the UI.
  3. Auto-infer the date based on surrounding rows or assign a default fallback.
- **Decision:** Auto-infer the date or assign a fallback, logging a warning in the Import Report.
- **Why:** The assignment requires a seamless import pipeline. Dropping rows disrupts the balance calculation. Since expenses are loosely sequential, inheriting the previous row's month/year allows the data to load while making it clear to the user (via the report) what was modified.

## 2. Managing Name Inconsistencies
- **Options Considered:**
  1. Treat "priya", "Priya", and "Priya S" as separate people.
  2. Implement an interactive merge tool.
  3. Automatically sanitize by standardizing capitalization and trimming loose initials.
- **Decision:** Automatically sanitize strings (Trim, Title Case, remove trailing initials if length == 1).
- **Why:** Typo-ridden names quickly pollute an expense tracking dashboard. A simple automated string transformation cleans 95% of user errors ("rohan" -> "Rohan") without needing complex UI logic.

## 3. Settlements vs. Expenses
- **Options Considered:**
  1. Treat settlements (like "Rohan paid Aisha 5000") as regular expenses where only Aisha is the "split_with".
  2. Extract them completely from the normal expense list.
- **Decision:** Extract them into a separate logical flow for debt calculation, bypassing the normal "expense" logic.
- **Why:** The note literally says "this is a settlement not an expense??". Treating it as an expense inflates Rohan's "Total Group Expenses" metric, which is inaccurate. It should only affect the net balances.

## 4. Multi-Currency Support (USD and INR)
- **Options Considered:**
  1. Create separate balances for USD and INR.
  2. Hardcode an exchange rate and convert everything to the base currency (INR).
- **Decision:** Convert all non-INR values to INR using a fixed exchange rate (e.g., 1 USD = 83 INR) during ingestion.
- **Why:** Splitting balances by currency complicates the "Who owes whom" graph significantly. A simple tracker should unify the debt into a single currency for easy settlement.

## 5. Percentage Split Totals Exceeding 100%
- **Options Considered:**
  1. Reject the row.
  2. Normalize the percentages.
- **Decision:** Normalize the percentages so they scale down to 100%.
- **Why:** If the user inputted 30/30/30/20, their intent was a relative ratio. Normalizing guarantees the math works out without losing the expense completely.
