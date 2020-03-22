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
