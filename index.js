const xlsx = require("xlsx");
const axios = require("axios");
const cheerio = require("cheerio");
const addToSheet = require("./utils/addToSheet");

const workbook = xlsx.readFile("xlsx/data.xlsx");

const ws = workbook.Sheets["영화목록"];

ws["!ref"] = ws["!ref"]
  .split(":")
  .map((e, i) => {
    if (i === 0) {
      return "A2";
    }
    return e;
  })
  .join(":");

const records = xlsx.utils.sheet_to_json(ws, { header: "A" });
console.log(records); // 문제 -> title 부분도 배열에 들어오기 떄문에   { A: '제목', B: '링크' }, => shift 한번 해준다.
console.log(ws["!ref"]); //A1:B11 파싱할 xlsx 범위

const crawler = async () => {
  addToSheet(ws, "C1", "s", "Rate");
  for (const [i, r] of records.entries()) {
    const res = await axios.get(r["B"]);
    if (res.status === 200) {
      const html = res.data;
      const $ = cheerio.load(html);
      //태그를 싹다 무시하고 알맹이만 뽑아온다.
      const text = $(".score.score_left .star_score").text();
      console.log(r["A"], text.trim());
      addToSheet(ws, `C${i + 2}`, "n", text.trim());
    }
  }
  xlsx.writeFile(workbook, "xlsx/result.xlsx");
};
crawler();
