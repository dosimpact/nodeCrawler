const xlsx = require("xlsx");
const axios = require("axios");
const cheerio = require("cheerio");

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

// for (const [i, e] of records.entries()) {
//   console.log(i, e["제목"]);
// }

const crawler = async () => {
  for (const [i, r] of records.entries()) {
    const res = await axios.get(r["링크"]);
    if (res.status === 200) {
      const html = res.data;
      const $ = cheerio.load(html);
      //태그를 싹다 무시하고 알맹이만 뽑아온다.
      const text = $(".score.score_left .star_score").text();
      console.log(r["제목"], text.trim());
    }
  }
  //   await Promise.all(
  //     records.map(async r => {
  //       const res = await axios.get(r["링크"]);
  //       if (res.status === 200) {
  //         const html = res.data;
  //         const $ = cheerio.load(html);
  //         const text = $(".score.score_left .star_score").text();
  //         console.log(r["제목"], text.trim());
  //       }
  //     })
  //   );
};

/**
-for 문 + await 로 매번 응답을 기다리면서 시행. 
타이타닉 9.37
아바타 9.07
매트릭스 9.40
반지의 제왕 9.28
어벤져스 8.80
겨울왕국 9.12
트랜스포머 8.85
해리 포터 9.25
다크나이트 9.33
캐리비안의 해적 9.07
 */
