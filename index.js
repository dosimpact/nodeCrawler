const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const pt = require("puppeteer");
const stringify = require("csv-stringify/lib/sync");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString());

const crawler = async () => {
  const brs = await pt.launch({
    headless: process.env.NODE_ENV === "production"
  });
  const result = [];
  try {
    const page = await brs.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"
    );

    for (const [i, r] of records.entries()) {
      await page.goto(r[1]);
      console.log(await page.evaluate("navigator.userAgent"));
      const text = await page.evaluate(() => {
        const score = document.querySelector(".score.score_left .star_score");
        return score.textContent.trim();
      });
      console.log(text);
      await page.waitFor(3000);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await brs.close();
    const str = stringify(result);
    //fs.writeFileSync("csv/result.csv", str);
  }
};

crawler();
