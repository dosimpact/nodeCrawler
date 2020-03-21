import xlsx from "xlsx";
import addToSheet from "./utils/addToSheet";

const workbook = xlsx.readFile("xlsx/data.xlsx");

console.log(workbook.SheetNames); //[ '영화목록' ]

const ws = workbook.Sheets[workbook.SheetNames[0]];
const records = xlsx.utils.sheet_to_json(ws);
console.log(records);

const ws2 = workbook.Sheets[workbook.SheetNames[0]];

ws2["!ref"] = ws["!ref"]
  .split(":")
  .map((e, i) => {
    if (i == 0) {
      return "A2";
    }
    return e;
  })
  .join(":");
const records2 = xlsx.utils.sheet_to_json(ws2, { header: "A" });
console.log(records2);
console.log(records2[0]["A"]);

addToSheet(ws2, "C1", "s", "pk");
records2.forEach((e, i) => {
  addToSheet(ws2, `C${i + 2}`, "n", i);
});

xlsx.writeFile(workbook, "xlsx/resultPK.xlsx");
