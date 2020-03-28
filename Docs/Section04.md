# 4-1. 인피니트 스크롤링과 postman

- postman
- 원하는 HTTP 요청을 보낼 수 있다.
- 크롤링할 대상 페이지가 정적인지, 동적인지 판단할때

# 4-2. 인피니트 스크롤 태그 분석하기

```js
const fs = require("fs");
const pt = require("puppeteer");
const axios = require("axios");

const crawler = async () => {
  try {
    const browser = await pt.launch({
      headless: false,
      args: ["--Window-size=1920.1080"]
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1920, height: 1080 });
    await page.goto("https://unsplash.com", { waitUntil: "networkidle2" });
    const result = await page.evaluate(() => {
      let imgsURL = [];
      const imgEls = document
        .querySelector(
          "#app > div > div:nth-child(5) > div._2HheS._2sCnE.PrOBO._1CR66 > div:nth-child(1) > div > div"
        )
        .querySelectorAll("img._2zEKz");
      imgEls.forEach(e => {
        imgsURL.push(e.src);
      });
      return imgsURL;
    });
    console.log(result);
    await page.close();
    await browser.close();
  } catch (error) {
    console.error(error);
  }
};

crawler();
```

# 4-3. 스크롤 내리고 태그 기다리기

-DOM 을 조작할 수 있으므로, 크롤링하고 난후, HTML을 지울 수 있다.

```js
El.parentElement.removeChild(El);
```

# 4-4. 스크롤 조작해서 크롤링하기

- 스크롤 내리기 명령 ( 너무 쉽다. )

```js
DOM에서;
window.scrollBy(0, 1000); //상대 좌표
window.scrollTo(0, 0); //절대 좌표

await page.waitForSelecctor("");
```

- 최종

```js
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
```

# 4-5. 크롤링 결과를 파일로 만들기

```js
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
    while (imgSrcs.length <= 30) {
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

    fs.readdir("imgs", e => {
      if (e) {
        fs.mkdirSync("imgs");
      }
    });
    await Promise.all(
      imgSrcs.map(async src => {
        const res = await axios.get(src.replace(/\?.*$/, ""), {
          responseType: "arraybuffer"
        });
        if (res.data) {
          fs.writeFileSync(`imgs/${Date.now()}.jpeg`, res.data);
        }
      })
    );
  } catch (error) {
    console.error(error);
  }
};

crwaler();
```

# 4-6. 보너스: 퍼펫티어 Q&A

# 4-7. 보너스: 태그 바뀌었을 때 대처법 & copy selector
