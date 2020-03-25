import pt from "puppeteer";
const start = async () => {
  const browser = await pt.launch({
    headless: false,
    args: ["--Window-size=1920,1080"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto("https://movie.naver.com/movie/bi/mi/basic.nhn?code=72363");
  await page.setRequestInterception(true);
  page.on("request", request => {
    if (request.resourceType() === "image") request.abort();
    else request.continue();
  });
  await page.waitFor(5000);
  await browser.close();
};

start();
