# 1.2

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
