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
window.scrollBy(0, 1000); //상대 좌표
window.scrollTo(0, 0); //절대 좌표

await page.waitForSelecctor("");
```

# 4-5. 크롤링 결과를 파일로 만들기

# 4-6. 보너스: 퍼펫티어 Q&A

# 4-7. 보너스: 태그 바뀌었을 때 대처법 & copy selector

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
    const imgURLS = [];

    setInterval(async () => {
      for (let i = 0; i < 10; i++) {
        await page.evaluate(() => {
          window.scrollBy(0, 300);
        });
        page.waitFor(100);
      }
    }, 5000);

    while (true) {
      await page.waitFor(5000);
      try {
        //const result =
        await page.evaluate(async () => {
          let imgsURL = [];
          const containerEl = document.querySelector(
            "#app > div > div:nth-child(5) > div._2HheS._2sCnE.PrOBO._1CR66 > div:nth-child(1) > div > div"
          );
          let imageContainerEls = containerEl.querySelectorAll(
            "div.nDTlD img._2zEKz"
          );
          console.log("imageContainerEls LEN : ", imageContainerEls.length);
          // if (imageContainerEls.length) {
          //   imageContainerEls.forEach(async e => {
          //     const src = e.src;
          //     if (src) {
          //       e.parentElement.removeChild(e);
          //       imgsURL.push(src);
          //     }
          //   });
          // }
          //return imgsURL;
        });
        imgURLS.push(...result);
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    }
    // while (true) {
    //   if (imgURLS.length >= 100) {
    //     break;
    //   }
    //   const result = await page.evaluate(() => {
    //     let imgsURL = [];
    //     window.scrollBy(0, 5000);
    //     const containerEl = document.querySelector(
    //       "#app > div > div:nth-child(5) > div._2HheS._2sCnE.PrOBO._1CR66 > div:nth-child(1) > div > div"
    //     );
    //     const imageContainerEls = containerEl.querySelectorAll(".nDTlD");
    //     console.log("imageContainerEls LEN : ", imageContainerEls.length);
    //     imageContainerEls.forEach(e => {
    //       const ImgEl = e.querySelector("img._2zEKz");
    //       console.log(ImgEl.src);
    //       imgsURL.push(ImgEl.src);
    //     });
    //     return imgsURL;
    //   });
    //   await page.evaluate(() => {
    //     for (let i = 0; i < 100; i++) {
    //       window.scrollBy(0, 10000);
    //     }
    //     page.waitFor(100);
    //   });
    //   await page.waitFor(3000);
    //   imgURLS.push(...result);
    // }
    console.log(imgURLS);
    //await page.close();
    //await browser.close();
  } catch (error) {
    console.error(error);
  }
};

crawler();
//
```
