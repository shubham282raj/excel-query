import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { fetchExcel } from "../utils/fetchExcel";
import ExcelTables from "./ExcelTables";
import "./Form.css";

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
      seatTypeExclude,
      gender,
      openingMinRank,
      openingMaxRank,
      closingMinRank,
      closingMaxRank,
      sort,
    } = data;

    const filteredData = rawData.filter((row) => {
      const instituteWords = institute.split(" ").filter(Boolean);
      const academicProgramWords = academicProgram.split(" ").filter(Boolean);
      const quotaWords = quota.split(" ").filter(Boolean);
      const seatTypeWords = seatType.split(" ").filter(Boolean);
      const seatTypeExcludeWords = seatTypeExclude.split(" ").filter(Boolean);
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
          row["Academic Program Name"]
            .toLowerCase()
            .includes(word.toLowerCase())
        );
      const quotaMatch =
        quotaWords.length === 0 ||
        quotaWords.every((word) =>
          row["Quota"].toLowerCase().includes(word.toLowerCase())
        );
      const seatTypeMatch =
        (seatTypeWords.length === 0 ||
          seatTypeWords.every((word) =>
            row["Seat Type"].toLowerCase().includes(word.toLowerCase())
          )) &&
        (seatTypeExcludeWords.length === 0 ||
          seatTypeExcludeWords.every(
            (word) =>
              !row["Seat Type"].toLowerCase().includes(word.toLowerCase())
          ));
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

    if (sort === "") {
    } else if (sort === "Opening Rank" || sort === "Closing Rank")
      filteredData.sort((a, b) => a[sort] - b[sort]);
    else filteredData.sort((a, b) => a[sort].localeCompare(b[sort]));

    return filteredData;
  };

  const onSubmit = async (formData) => {
    let storedExcelData = localStorage.getItem("excelData");
    if (!storedExcelData) {
      storedExcelData = await fetchExcel();
      localStorage.setItem("excelData", JSON.stringify(storedExcelData));
    } else {
      storedExcelData = JSON.parse(storedExcelData);
    }

    const filteredData = handleFormQuery(storedExcelData, formData);
    setExcelData(filteredData);
  };

  return (
    <div>
      <form id="form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>
            Institute Type:
            <select {...register("instituteType")}>
              <option value="">All</option>
              <option value="Indian Institute of Technology">IIT</option>
              <option value="National Institute of Technology">NIT</option>
              <option value="Indian Institute of Information Technology">
                IIIT
              </option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Institute:
            <input
              placeholder="leave empty for all institutes"
              type="text"
              {...register("institute")}
            />
          </label>
        </div>
        <div>
          <label>
            Branch:
            <input
              placeholder="leave empty for all branches"
              type="text"
              {...register("academicProgram")}
            />
          </label>
        </div>
        <div>
          <label>
            Quota:
            <input
              placeholder="eg. AI, HS, OS, GO, JK, LA"
              type="text"
              {...register("quota")}
            />
          </label>
        </div>
        <div>
          <label>
            Category:
            <div></div>
            <div>
              <input
                type="text"
                placeholder="Include"
                {...register("seatType")}
              />
              <input
                type="text"
                placeholder="Exclude"
                {...register("seatTypeExclude")}
              />
            </div>
          </label>
        </div>
        <div>
          <label>
            Gender:
            <select {...register("gender")}>
              <option value="">All</option>
              <option value="neutral">Gender-Neutral</option>
              <option value="female">Female-only</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Opening Rank:
            <div>
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
            </div>
          </label>
        </div>
        <div>
          <label>
            Closing Rank:
            <div>
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
            </div>
          </label>
        </div>
        <div>
          <label>
            Sort:
            <select {...register("sort")}>
              <option value="">Default</option>
              <option value="Institute">Institute</option>
              <option value="Academic Program Name">Branch</option>
              <option value="Quota">Quota</option>
              <option value="Seat Type">Category</option>
              <option value="Gender">Gender</option>
              <option value="Opening Rank">Opening Rank</option>
              <option value="Closing Rank">Closing Rank</option>
            </select>
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      {<ExcelTables excelData={excelData} />}
    </div>
  );
}

export default CollgeForm;
