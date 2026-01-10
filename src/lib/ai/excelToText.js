import * as XLSX from "xlsx";

export function excelToText(buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  let text = "";

  for (const sheetName of workbook.SheetNames) {
    text += `Sheet: ${sheetName}\n`;
    text += XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
    text += "\n\n";
  }

  return text.trim();
}
