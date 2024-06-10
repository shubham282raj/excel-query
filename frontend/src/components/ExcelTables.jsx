import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function ExcelTables() {
  const [excelData, setExcelData] = useState([]);

  useEffect(() => {
    const fetchExcel = async () => {
      const excelUrl =
        "https://raw.githubusercontent.com/shubham282raj/excel-query/main/josaa.xlsx";
      try {
        const response = await fetch(excelUrl);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });
        const firstSheetName = workbook.SheetNames[0];
        const excelData = XLSX.utils.sheet_to_json(
          workbook.Sheets[firstSheetName]
        );
        setExcelData(excelData);
      } catch (error) {
        console.error("Error fetching Excel file:", error);
      }
    };
    fetchExcel();
  }, []);

  return (
    <div>
      <h1>Excel Data Table</h1>
      <table border="1">
        <thead>
          <tr>
            {excelData.length > 0 &&
              Object.keys(excelData[0]).map((header) => (
                <th key={header}>{header}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {excelData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExcelTables;
