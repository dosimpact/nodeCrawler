# 5-1. 페이스북 로그인 태그 분석

- 입력하기 ( 셀레늄에서는 키보드 입력처럼 하지만, 여기서는 DOM 처리)

input 엘리먼트 찾아서 .value = '값 넣기'

- 클릭하기

엘리먼트.click()

- .env > props > evaluate 전달

```js
let emailEl = document.querySelector("#email");
...
let pwdEl = document.querySelector("#pass");
pwdEl.value = "Fadud5386!!";

let loginEl = document.querySelector("#loginbutton");
loginEl.click()
---

const props = { id: "내아이디", pw: "내 비빌번호" };
await page.evaluate(props => {
  console.log(props);
}, props);
```

```js
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

    const props = { id: process.env.ID, pw: process.env.PW };
    await page.evaluate(props => {
      console.log(props);
    }, props);
  } catch (error) {
    console.log(error);
  }
};

crawler();
```

# 5-2. dotenv로 비밀번호 관리하기

# 5-3. type, hover, click, keyboard

- 키보드 표
  [https://github.com/puppeteer/puppeteer/blob/master/lib/USKeyboardLayout.js#L123](https://github.com/puppeteer/puppeteer/blob/master/lib/USKeyboardLayout.js#L123)

- type 타이핑 효과, hover 마우스 올린효과, click 마우스 누루기, keyborad ... 키보드 누르는 효과

```js
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
```

- 페이스북은 로그인했을때, 검은화면 + 알림권한을 받는다. > ESC 를 누르면 검은 화면 제거됨

# 5-4. 페이스북 로그아웃

- 이벤트 가로채기 ( alert 이벤트 )

```js
page.on("dialog", async dialog => {
  console.log(dialog.message());
  await dialog.dismiss();
});

await page.evaluate(() => {
  alert("hello");
});
```

# 5-5. waitForResponse

- 서버 리스폰을 기다리는 코드인데, 잘 모르겠다. 아직은..

```js
await page.waitForResponse(res => {
  if (res.url().includes("login_attempt")) {
    console.log(res, res.url());
  }
  return res.url().includes("login_attempt");
});
```

# 5-6. 마우스 조작하기

# 5-7. focus와 대문자 입력하기

# 5-8. alert, confirm, prompt 대응하기
