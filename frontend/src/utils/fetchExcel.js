import * as XLSX from "xlsx";

export const fetchExcel = async () => {
  const excelUrl =
    "https://raw.githubusercontent.com/shubham282raj/excel-query/main/josaa.xlsx";
  try {
    const response = await fetch(excelUrl);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
      type: "array",
    });
    const firstSheetName = workbook.SheetNames[0];
    const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
    return excelData;
  } catch (error) {
    console.error("Error fetching Excel file:", error);
  }
};
