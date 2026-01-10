export function groupInvoices(rows) {
  const map = new Map();

  for (const row of rows) {
    const serial =
      row["Invoice No"] ||
      row["Invoice Number"] ||
      row["Serial Number"] ||
      row["Bill No"];

    if (!serial) continue;

    if (!map.has(serial)) {
      map.set(serial, []);
    }

    map.get(serial).push(row);
  }

  return Array.from(map.entries()).map(([serialNumber, rows]) => ({
    serialNumber,
    rows,
  }));
}
