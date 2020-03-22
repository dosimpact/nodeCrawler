# 2-1. puppeteer 시작하기

- npm i puppeteer

```js
const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const pt = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString());

const crawler = async () => {
  const brs = await pt.launch({ headless: false });
  const page = await brs.newPage();
  await page.goto("https://zerocho.com");
  await page.waitFor(3000);
  await page.close();
  await brs.close();
};

crawler();
```

# 2-2. headless 옵션 이해하기

```js
const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const pt = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString());

const crawler = async () => {
  const brs = await pt.launch({
    headless: process.env.NODE_ENV === "production"
  });

  const [page1, page2, page3] = await Promise.all([
    brs.newPage(),
    brs.newPage(),
    brs.newPage()
  ]);

  await Promise.all([
    page1.goto("https://zerocho.com"),
    page2.goto("https://www.naver.com"),
    page3.goto("https://google.com")
  ]);
  await Promise.all([
    page1.waitFor(3000),
    page2.waitFor(3000),
    page3.waitFor(3000)
  ]);
  await page1.close();
  await page2.close();
  await page3.close();
  await brs.close();
};

crawler();
```

# 2-3. 첫 puppeteer 크롤링

- promise가 있다면 try/catch로 한번 감싸줘라.
- async 함수 하나당 try/catch하나로 감싸주어야 한다.

- ? Promise.all 에 배열 안에 하나의 promise객체를 반환하는 함수들을 쓰는것과,
- ? Promise.all 에 map함수를 이용해서 코드를 작성하는것의 차이.

```js
const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const pt = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString());

const crawler = async () => {
  const brs = await pt.launch({
    headless: process.env.NODE_ENV === "production"
  });
  try {
    await Promise.all(
      records.map(async (r, i) => {
        try {
          const page = await brs.newPage();
          await page.goto(r[1]);
          const scoreEl = await page.$(".score.score_left .star_score");
          if (scoreEl) {
            const text = await page.evaluate(tag => tag.textContent, scoreEl);
            console.log(r[0], "rate", text.trim());
          }
          await page.close();
        } catch (e) {
          console.error(e);
        }
      })
    );
  } catch (e) {
    console.error(e);
  } finally {
    await brs.close();
  }
};

crawler();
```

# 2-4. csv에 출력하기

-npm i csv-stringify

```js
const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const pt = require("puppeteer");
const stringify = require("csv-stringify/lib/sync");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString());

const crawler = async () => {
  const result = [];
  const brs = await pt.launch({
    headless: process.env.NODE_ENV === "production"
  });
  try {
    await Promise.all(
      records.map(async (r, i) => {
        try {
          const page = await brs.newPage();
          await page.goto(r[1]);
          const scoreEl = await page.$(".score.score_left .star_score");
          if (scoreEl) {
            const text = await page.evaluate(tag => tag.textContent, scoreEl);
            console.log(r[0], "rate", text.trim());
            //fb 순서를 보장해서 넣을 수 있다.
            //result.push([r[0], r[1], text.trim()]);
            result[i] = [r[0], r[1], text.trim()];
          }
          await page.close();
        } catch (e) {
          console.error(e);
        }
      })
    );
  } catch (e) {
    console.error(e);
  } finally {
    await brs.close();
    const str = stringify(result);
    fs.writeFileSync("csv/result.csv", str);
  }
};

crawler();
```

# 2-5. page.evaluate 사용하기

- document 객체를 사용할 수 있다.

```js
const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const pt = require("puppeteer");
const stringify = require("csv-stringify/lib/sync");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString());

const crawler = async () => {
  const result = [];
  const brs = await pt.launch({
    headless: process.env.NODE_ENV === "production"
  });
  try {
    await Promise.all(
      records.map(async (r, i) => {
        try {
          const page = await brs.newPage();
          await page.goto(r[1]);
          const text = await page.evaluate(() => {
            const score = document.querySelector(
              ".score.score_left .star_score"
            );
            if (score) {
              //console.log(score);
              return score.textContent;
            }
          });
          console.log(text.trim());
          await page.close();
        } catch (e) {
          console.error(e);
        }
      })
    );
  } catch (e) {
    console.error(e);
  } finally {
    await brs.close();
    const str = stringify(result);
    //fs.writeFileSync("csv/result.csv", str);
  }
};

crawler();
```

[https://try-puppeteer.appspot.com/](https://try-puppeteer.appspot.com/)

- 이미지 빼고 돌리기
- 스크릿샷
- 풀 스크린샷
- pdf 변환

# 2-6. userAgent와 한 탭으로 크롤링
