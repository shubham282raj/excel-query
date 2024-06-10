import React from "react";
import "./ExcelTables.css";

function ExcelTables({ excelData }) {
  if (excelData) {
    return (
      <div id="table">
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
}

export default ExcelTables;
