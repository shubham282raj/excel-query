import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { fetchExcel } from "../utils/fetchExcel";
import ExcelTables from "./ExcelTables";

function CollgeForm() {
  const [excelData, setExcelData] = useState([]);
  const { register, handleSubmit } = useForm();

  const handleFormQuery = (rawData, data) => {
    const {
      instituteType,
      institute,
      academicProgram,
      quota,
      seatType,
      gender,
      openingMinRank,
      openingMaxRank,
      closingMinRank,
      closingMaxRank,
    } = data;

    const filteredData = rawData.filter((row) => {
      const instituteWords = institute.split(" ").filter(Boolean);
      const academicProgramWords = academicProgram.split(" ").filter(Boolean);
      const quotaWords = quota.split(" ").filter(Boolean);
      const seatTypeWords = seatType.split(" ").filter(Boolean);
      const genderWords = gender.split(" ").filter(Boolean);

      const collegeTypeMatch = row["Institute"]
        .toLowerCase()
        .includes(instituteType.toLowerCase());

      const collegeMatch =
        instituteWords.length === 0 ||
        instituteWords.every((word) =>
          row["Institute"].toLowerCase().includes(word.toLowerCase())
        );
      const programMatch =
        academicProgramWords.length === 0 ||
        academicProgramWords.every((word) =>
          row["Academic Program"].toLowerCase().includes(word.toLowerCase())
        );
      const quotaMatch =
        quotaWords.length === 0 ||
        quotaWords.every((word) =>
          row["Quota"].toLowerCase().includes(word.toLowerCase())
        );
      const seatTypeMatch =
        seatTypeWords.length === 0 ||
        seatTypeWords.every((word) =>
          row["Seat Type"].toLowerCase().includes(word.toLowerCase())
        );
      const genderMatch =
        genderWords.length === 0 ||
        genderWords.every((word) =>
          row["Gender"].toLowerCase().includes(word.toLowerCase())
        );
      const openingRankMatch =
        (!openingMinRank ||
          Number(row["Opening Rank"]) >= Number(openingMinRank)) &&
        (!openingMaxRank ||
          Number(row["Opening Rank"]) <= Number(openingMaxRank));

      const closingRankMatch =
        (!closingMinRank ||
          Number(row["Closing Rank"]) >= Number(closingMinRank)) &&
        (!closingMaxRank ||
          Number(row["Closing Rank"]) <= Number(closingMaxRank));

      return (
        collegeTypeMatch &&
        collegeMatch &&
        programMatch &&
        quotaMatch &&
        seatTypeMatch &&
        genderMatch &&
        openingRankMatch &&
        closingRankMatch
      );
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
            Institute Type:
            <select {...register("instituteType")}>
              <option value="">All</option>
              <option value="Indian Institute of Technology">IIT</option>
              <option value="National Institute of Technology">NIT</option>
              <option value="Indian Institutes of Information Technology">
                IIIT
              </option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Institute:
            <input type="text" {...register("institute")} />
          </label>
        </div>
        <div>
          <label>
            Academic Program:
            <input type="text" {...register("academicProgram")} />
          </label>
        </div>
        <div>
          <label>
            Quota:
            <input type="text" {...register("quota")} />
          </label>
        </div>
        <div>
          <label>
            Seat Type:
            <input type="text" {...register("seatType")} />
          </label>
        </div>
        <div>
          <label>
            Gender:
            <input type="text" {...register("gender")} />
          </label>
        </div>
        <div>
          <label>
            Opening Rank:
            <input
              type="number"
              placeholder="Minimum"
              {...register("openingMinRank")}
            />
            <input
              type="number"
              placeholder="Maximum"
              {...register("openingMaxRank")}
            />
          </label>
        </div>
        <div>
          <label>
            Closing Rank:
            <input
              type="number"
              placeholder="Minimum"
              {...register("closingMinRank")}
            />
            <input
              type="number"
              placeholder="Maximum"
              {...register("closingMaxRank")}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      {<ExcelTables excelData={excelData} />}
    </div>
  );
}

export default CollgeForm;
