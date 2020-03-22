# 3-1. 이미지 다운로드 준비하기

- 폴더 만들기

```js
const setStorage = () => {
  fs.readdir("poster", e => {
    if (e) {
      console.log("make dir ./poster");
      fs.mkdirSync("poster");
    }
  });
};

setStorage();
```

- 셀렉터를 통해, 태그 핸들러로 가져오고, 거기서
- src 속성 값을 가져오거나
- textContent 값을 가져오거나 한다.

```js
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
```

- 네이버 영화 이미지는, 쿼리 스트링 부분을 없애주면, 고화질로 바뀐다.

# 3-2. axios로 이미지 저장하기

- 이미지는 용량이 크다 보니까 버퍼가 배열처럼 되어 있다.
- arraybuffer 라는 자료구조로 이미지를 받아야 한다.

```js
if (img) {
  const imgResult = await axios.get(img, { responseType: "arraybuffer" });
  fs.writeFileSync(`poster/${r[0]}.jpg`, imgResult.data);
}
// https://movie-phinf.pstatic.net/20181129_107/1543452551390CN9TW_JPEG/movie_image.jpg?type=m203_290_2

// 쿼리스트링 부분 제거

if (img) {
  const imgResult = await axios.get(img.replace(/\?.*$/, ""), {
    responseType: "arraybuffer"
  });
  fs.writeFileSync(`poster/${r[0]}.jpg`, imgResult.data);
}
```

- 참고 : fs.mkdirSync("poster");
- sync 메서드는 처음과 끝이면 써도 된다. 하지만 중간에 쓴다면 블락킹 되기 때문에 권장하지 않는다.

# 3-3. 브라우저 사이즈 조절과 스크린샷

# 3-4. 보너스: querySelector과 CSS 선택자

# 3-5. 보너스: CSS 선택자 조합하기

```

```
