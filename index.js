import pt from "puppeteer";
import axios from "axios";
import fs from "fs";

const crwaler = async () => {
  try {
    const browser = await pt.launch({
      headless: false,
      args: ["--Window-size=1920.1080"]
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1920, height: 1080 });
    await page.goto("https://unsplash.com/", { waitUntil: "networkidle2" });

    //page 가 close 될때 reset 해주어 한다. 안그러면 leak
    const infiniteScroll = async () => {
      await page.evaluate(() => {
        window.scrollBy(0, -100);
        window.scrollBy(0, 1000);
      });
    };
    const infiniteScrollEvent = setInterval(infiniteScroll, 100);

    let imgSrcs = [];
    while (imgSrcs.length <= 300) {
      await page.waitForSelector(".nDTlD");
      const res = await page.evaluate(() => {
        const imgSrcs = [];
        let containerEls = document.querySelectorAll(".nDTlD");
        try {
          containerEls.forEach(E => {
            const imgEl = E.querySelector("img._2zEKz");
            if (imgEl) {
              const imgSrc = imgEl.getAttribute("src");
              if (imgSrc) {
                imgSrcs.push(imgSrc);
                E.parentElement.removeChild(E);
              }
            }
          });
        } catch (error) {}
        return imgSrcs;
      });
      imgSrcs = imgSrcs.concat(res);
      console.log(" ✅ crwaling... ", imgSrcs.length);
    }
    console.log(imgSrcs);
    console.log(" ✅ Successfull!! ", imgSrcs.length);
    clearInterval(infiniteScrollEvent);
    await page.close();
    await browser.close();
  } catch (error) {
    console.error(error);
  }
};

crwaler();
