import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { fetchExcel } from "../utils/fetchExcel";
import ExcelTables from "./ExcelTables";

function CollgeForm() {
  const [excelData, setExcelData] = useState([]);
  const { register, handleSubmit } = useForm();

  const handleFormQuery = (rawData, data) => {
    const filteredData = rawData.filter((row) => {
      const collegeMatch = row["Institute"].includes(data.collegeName);
      const rankMatch =
        Number(row["Closing Rank"]) >= Number(data.minRank) &&
        Number(row["Closing Rank"]) <= Number(data.maxRank);
      return collegeMatch && rankMatch;
    });
    return filteredData;
  };

  const onSubmit = async (formData) => {
    let storedExcelData = localStorage.getItem("excelData");
    if (!storedExcelData) {
      let fetchedExcel = await fetchExcel();
      storedExcelData = JSON.stringify(fetchedExcel);
      localStorage.setItem("excelData", storedExcelData);
    } else {
      storedExcelData = JSON.parse(storedExcelData);
    }

    const filteredData = handleFormQuery(storedExcelData, formData);
    setExcelData(filteredData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>
            College Name:
            <input type="text" {...register("collegeName")} />
          </label>
        </div>
        <div>
          <label>
            Min Rank:
            <input type="number" {...register("minRank")} />
          </label>
        </div>
        <div>
          <label>
            Max Rank:
            <input type="number" {...register("maxRank")} />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      {<ExcelTables excelData={excelData} />}
    </div>
  );
}

export default CollgeForm;
