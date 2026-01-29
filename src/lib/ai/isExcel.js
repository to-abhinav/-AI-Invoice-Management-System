import * as XLSX from "xlsx";

async function isExcel(file) {
  async function hasExcelSignature(file) {
    const slice = file.slice(0, 4);
    const arrayBuffer = await slice.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    const hex = Array.from(uint8Array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    console.log("here is hex----------");
    console.log(hex);
    
    return (
      hex === "504b0304" ||
      hex === "d0cf11e0"    
    );
  }

  if (!(await hasExcelSignature(file))) {
    return false;
  }

  try {
    // Read the entire file as ArrayBuffer for XLSX
    const arrayBuffer = await file.arrayBuffer();
    XLSX.read(arrayBuffer, { type: "array" });
  } catch {
    return false;
  }
  return true;
}

export default isExcel;