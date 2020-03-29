# 6-1. 프록시 설명과 태그 분석

- 서버가 IP 기반으로 클라이언틀르 차단한다.
- 프록시 사이트에서 IP를 저장하고, DB 저장, 나를 속여보기

# 프록시?

- 프록시는 대리인이라는 뜻이다.

- 내 IP 말고 다른 사람의 IP로 서버로 요청을 대신 보내준다.
- 프록시는 또 서버가 필요하다. 해당 서비스를 해주는 IP로 변조된다. ( 서버마다 응답속도가 다르다.)
  [http://spys.one/free-proxy-list/KR/](http://spys.one/free-proxy-list/KR/)

- 프록시 타입 > socks5 : 토르 브라우저 같은거
- 프록시 익명성 > NOA 라는 서버는 원래 내가 누군지 들통 | HIA 나 ANM 옵션이 있어야 내가 숨겨짐.

- nth-of-type()

```js
document
  .querySelector(
    "body > table:nth-child(3) > tbody > tr:nth-child(5) > td > table > tbody"
  )
  .querySelector("tr:nth-of-type(4)");
```

# 6-2. 프록시 ip 적용하기

- 크롬 launch 시 옵션 주기
  [https://peter.sh/experiments/chromium-command-line-switches/](https://peter.sh/experiments/chromium-command-line-switches/)

```js
--proxy-server ⊗	Uses a specified proxy server, overrides system settings. This switch only affects HTTP and HTTPS requests. ↪
--disable-notifications ⊗	Disables the Web Notification and the Push APIs. ↪

await pt.launch({
  headless:false,
  args:['--window-size=1920,1080','--disable-notifications',`--proxy-server=${IP}`]
})

// HTTP 타입의 프록시 허용
 '--ignore-certificate-errors'
```

# 6-3. 데이터베이스 연동하기

# 6-4. 크롤링 결과물 데이터베이스에 저장하기

# 6-5. 브라우저 여러 개 사용하기
