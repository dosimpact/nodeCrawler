import "./env";
import pt from "puppeteer";

const crawler = async () => {
  try {
    const brwoser = await pt.launch({
      headless: false,
      args: ["--window-size=1920,1080"]
    });
    const page = await brwoser.newPage();
    page.setViewport({ width: 1080, height: 1080 });
    await page.goto("https://www.facebook.com/");
    await page.waitFor(5000);

    await page.waitForSelector("#email"); // so Easy
    await page.type("#email", process.env.ID); // 타이핑 효과
    await page.type("#pass", process.env.PW);
    await page.waitFor(3000);
    await page.hover("#loginbutton"); // on호버
    await page.click("#loginbutton"); // on클릭

    await page.waitFor(3000);
    await page.keyboard.press("Escape");
    await page.click("HTML");

    const props = { id: process.env.ID, pw: process.env.PW };
    await page.evaluate(props => {
      console.log(props);
    }, props);
  } catch (error) {
    console.log(error);
  }
};

crawler();
