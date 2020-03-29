import "./env";
import fs from "fs";
import axios from "axios";
import pt from "puppeteer";

// splash 크롤링

console.log(process.env.IMG_LIMIT);
const IP = "58.233.211.104:8080";

const crawling = async () => {
  try {
    const browser = await pt.launch({
      headless: false,
      args: ["--window-size=1920,1080"]
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1920, height: 1080 });
    await page.goto("https://unsplash.com/");
    const infiniteScroll = async () => {
      page.evaluate(() => {
        window.scrollBy(0, -100);
        window.scrollBy(0, 1000);
      });
    };
    const EventInfiniteScroll = setInterval(infiniteScroll, 1000);

    let imgSrcs = [];

    while (imgSrcs.length < process.env.IMG_LIMIT) {
      await page.waitForSelector(".nDTlD");
      const res = await page.evaluate(() => {
        const imgSrcsTmp = [];
        const containerEls = document.querySelectorAll(".nDTlD");
        containerEls.forEach(El => {
          const imgEl = El.querySelector("img._2zEKz");
          if (imgEl) {
            const src = imgEl.getAttribute("src");
            if (src) {
              imgSrcsTmp.push(src);
              El.parentElement.removeChild(El);
            }
          }
        });
        return imgSrcsTmp;
      });
      imgSrcs = imgSrcs.concat(res);
      console.log(
        `✅ crawling... ${imgSrcs.length} / ${process.env.IMG_LIMIT}`
      );
    }
    console.log(imgSrcs);
    console.log(`✅ crawling complete !! .. ${imgSrcs.length}`);

    clearInterval(EventInfiniteScroll);

    console.log(`✅ fetching img... `);
    fs.readdirSync("imgs", e => {
      if (e) {
        fs.mkdirSync("imgs");
      }
    });

    await Promise.all(
      imgSrcs.map(async src => {
        try {
          const srcParsed = src.slice(0, src.indexOf("?"));
          console.log(`✅ ${srcParsed} fetching ... `);
          const res = await axios.get(srcParsed, {
            responseType: "arraybuffer"
          });
          if (res) {
            fs.writeFileSync(`imgs/${Date.now()}.jpeg`, res.data);
          }
        } catch (error) {
          console.log(`❌ fetching ${error}`);
        }
      })
    );
    await page.close();
    await browser.close();
  } catch (error) {
    console.log(`❌ ${error}`);
  } finally {
  }
};

crawling();
// axios 이미지 다운ㄷ
