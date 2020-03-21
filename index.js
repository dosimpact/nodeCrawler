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
