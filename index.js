const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const pt = require("puppeteer");
const stringify = require("csv-stringify/lib/sync");
const axios = require("axios");

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

      const { rate, img } = await page.evaluate(() => {
        const scoreEl = document.querySelector(".score.score_left .star_score");
        const imgEl = document.querySelector(
          "#content > div.article > div.mv_info_area > div.poster > a > img"
        );
        if (scoreEl && imgEl) {
          return { rate: scoreEl.textContent.trim(), img: imgEl.src };
        } else {
          return { rate: 0, img: null };
        }
      });
      console.log(rate, img);
      if (img) {
        const imgResult = await axios.get(img.replace(/\?.*$/, ""), {
          responseType: "arraybuffer"
        });
        fs.writeFileSync(`poster/${r[0]}.jpg`, imgResult.data);
      }
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

const setStorage = () => {
  fs.readdir("poster", e => {
    if (e) {
      console.log("make dir ./poster");
      fs.mkdirSync("poster");
    }
  });
};

setStorage();
crawler();
