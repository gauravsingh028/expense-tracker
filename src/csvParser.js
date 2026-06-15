import Papa from 'papaparse';

const sanitizeName = (name) => {
  if (!name) return "Unknown";
  let cleanName = name.trim();
  // Capitalize first letter
  cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
  // Remove trailing single initials (like "Priya S" -> "Priya")
  if (cleanName.length > 2 && cleanName.charAt(cleanName.length - 2) === ' ') {
    cleanName = cleanName.slice(0, cleanName.length - 2);
  }
  return cleanName;
};

export const parseCSV = async (csvUrl) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;
        const parsedExpenses = [];
        const anomalies = [];
        let previousValidDate = "1/1/2026";

        data.forEach((row, index) => {
          const rowNum = index + 2; // +1 for 0-index, +1 for header
          
          let dateStr = row.date?.trim() || "";
          
          // Anomaly 1: Messy dates
          if (dateStr === "########" || !dateStr) {
            anomalies.push({ row: rowNum, issue: `Missing/invalid date '${dateStr}'`, action: `Inferred date from previous row: ${previousValidDate}` });
            dateStr = previousValidDate;
          } else if (dateStr.includes("202") && !dateStr.includes("2026")) {
            anomalies.push({ row: rowNum, issue: `Truncated year '${dateStr}'`, action: `Padded year to 2026` });
            dateStr = dateStr.replace("202", "2026");
            previousValidDate = dateStr;
          } else if (dateStr === "14-Mar") {
            anomalies.push({ row: rowNum, issue: `Date format '14-Mar'`, action: `Assumed 2026 year: 14/03/2026` });
            dateStr = "14/03/2026";
            previousValidDate = dateStr;
          } else {
            previousValidDate = dateStr;
          }

          let paidBy = sanitizeName(row.paid_by);
          if (row.paid_by !== paidBy && row.paid_by) {
             anomalies.push({ row: rowNum, issue: `Inconsistent name capitalization/typo '${row.paid_by}'`, action: `Sanitized to '${paidBy}'` });
          }

          if (!row.paid_by) {
            anomalies.push({ row: rowNum, issue: `Missing 'paid_by' for '${row.description}'`, action: `Assigned to 'Unknown'` });
          }

          let originalAmount = parseFloat(row.amount);
          let amount = originalAmount;
          let currency = row.currency?.trim() || "INR";

          // Anomaly 2: Currencies
          if (currency === "USD") {
            anomalies.push({ row: rowNum, issue: `Foreign currency 'USD'`, action: `Converted to INR at 83 INR/USD` });
            amount = originalAmount * 83;
          }

          // Anomaly 3: Invalid amounts
          if (isNaN(amount) || amount <= 0) {
             anomalies.push({ row: rowNum, issue: `Invalid or negative amount '${row.amount}'`, action: `Skipped row from standard expenses` });
             return; // Skip this row
          }
          
          let splitType = row.split_type?.trim().toLowerCase();
          
          // Anomaly 4: Settlements mixed in
          if (!splitType && row.notes && row.notes.toLowerCase().includes("settlement")) {
             anomalies.push({ row: rowNum, issue: `Settlement logged as expense '${row.description}'`, action: `Logged as settlement, bypassed regular expense tracking` });
             return; // Skip normal processing for settlements in this simplified dashboard
          }

          let splitWith = row.split_with ? row.split_with.split(';').map(sanitizeName) : [];

          parsedExpenses.push({
            id: `row-${rowNum}`,
            date: dateStr,
            description: row.description,
            paid_by: paidBy,
            amount: parseFloat(amount.toFixed(2)),
            currency: "INR", // normalized
            split_type: splitType,
            split_with: splitWith,
            notes: row.notes
          });
        });

        resolve({ expenses: parsedExpenses, anomalies });
      },
      error: (err) => {
        reject(err);
      }
    });
  });
};
