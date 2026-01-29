import * as XLSX from "xlsx";

export async function excelToJsonStrict(file) {
  if (!file) {
    throw new Error("Excel file not found");
  }

  const arrayBuffer = await file.arrayBuffer();
  
  const workbook = XLSX.read(arrayBuffer, {
    type: "array",
    cellDates: true,
  });

  const result = {};

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) continue;

    const rows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,          
      defval: null,
      blankrows: false,
    });

    if (rows.length === 0) {
      result[sheetName] = [];
      continue;
    }

    const [headers, ...dataRows] = rows;

    
    const normalized = dataRows
      .filter((row) => row && row.some((cell) => cell !== null && cell !== undefined && cell !== ""))
      .map((row) => {
        const obj = {};
        headers.forEach((key, colIndex) => {
          if (!key || key === null || key === undefined || String(key).trim() === "") return;
          
          const headerKey = String(key).trim();
          obj[headerKey] = row[colIndex] ?? null;
        });
        return obj;
      });

    result[sheetName] = normalized;
  }

  return result;
}