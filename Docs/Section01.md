# 1-1. 웹 크롤러 소개

# 1-2. csv-parse 패키지로 csv 파싱하기

- npm i csv-parse

```js
const parse = require("csv-parse/lib/sync");
const fs = require("fs");

const csv = fs.readFileSync("csv/data.csv"); //파일을 비동기적으로 읽는 메서드
console.log(csv.toString("utf-8")); //버퍼를 문자열로 바꾸는데 인코딩을 정해준다.

const records = parse(csv.toString("utf-8"));
console.log(records);

records.forEach((e, i) => {
  console.log(`${i}|영화 제목 : ${e[0]} -> URL : ${e[1]} `);
});
```

# 1-3. xlsx 패키지로 엑셀 파싱하기

npm i xlsx

```js
const xlsx = require("xlsx");

const workbook = xlsx.readFile("xlsx/data.xlsx");

//console.log(workbook); // 대단한 파싱 결과가 나온다.

console.log(Object.keys(workbook.Sheets)); //[ '영화목록' ]

const ws = workbook.Sheets["영화목록"];
//console.log(ws);

// 워크북 안에 시트가 있고, 괴랄한 형태의 시트를 SpreadSheet 마냥 읽는것이 sheet to json

const records = xlsx.utils.sheet_to_json(ws);
console.log(records);

records.forEach(e => {
  console.log(e["제목"], e["링크"]);
});

for (const [i, r] of records.entries()) {
  console.log(i, r["제목"], r["링크"]);
}
/**
 * [
  {
    '제목': '타이타닉',
    '링크': 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=18847'
  },
  {
    '제목': '아바타',
    '링크': 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=62266'
  },
  {
    '제목': '매트릭스',
    '링크': 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=24452'
  },
  {
    '제목': '반지의 제왕',
    '링크': 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=31794'
  },
  {
    '제목': '어벤져스',
    '링크': 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=72363'
  },
  {
    '제목': '겨울왕국',
    '링크': 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=100931'
  },
  {
    '제목': '트랜스포머',
    '링크': 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=61521'
  },
  {
    '제목': '해리 포터',
    '링크': 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=30688'
  },
  {
    '제목': '다크나이트',
    '링크': 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=62586'
  },
  {
    '제목': '캐리비안의 해적',
    '링크': 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=37148'
  }
]
 */
```

# 1-4. axios-cheerio로 첫 크롤링하기

npm i axios // ajax 라이브러리
npm i cheerio //HTML 파싱

# 1-5. Promise.all과 for of 문의 차이

```js
const xlsx = require("xlsx");
const axios = require("axios");
const cheerio = require("cheerio");

const workbook = xlsx.readFile("xlsx/data.xlsx");

const ws = workbook.Sheets;

//console.log(Object.keys(ws));

const records = xlsx.utils.sheet_to_json(ws["영화목록"]);

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
crawler();
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
```

# 1-6. 보너스: xlsx 패키지

- sheet_to_json에 옵션을 주어, 행은 숫자 , 열은 A,B..으로 접근이 가능하다.

- ws 시트에는 엑셀의 참조 범위가 나온다. !ref를 통해 범위를 확인할 수 있다.
- 해당 범위를 바꾸면 sheet_to_json 범위가 변경됨

```js
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
```

# 1-7. 보너스: api와의 차이점, 자동화

# 1-8. 보너스: 엑셀에 쓰기
