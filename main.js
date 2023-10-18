const express = require("express");
const app = express();
const port = process.env.PORT || 3000; // 포트 설정
const axios = require('axios').default

app.get("/ping", (req, res) => {
  res.send("OK"); // 루트 경로에 대한 응답
});
app.get("/bypass/:url", (req, res)=> { // url = percent encoded url
  var url = decodeURIComponent(req.params.url)
  var enc = encodeURIComponent(req.params.url)
  switch (new URL(url).host) {
    case "bstlar.com":
        axios.get(`https://bstlar.com/api/link?url=${encodeURIComponent(new URL(url).pathname.substring(1))}`, {
            headers: {'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134'}}).then(r=>{ // useragent: Edge
                if (r.data.link) {
                  res.send(`{"link":"${r.data.link.destination_url}","message":"Bypassed with bstlar API! link type!","type_bstlar":"url","type":"bstlar","api":"bstlar","apiMessage":"we used bstlar api to bypass!"}`)
                } else if (r.data.hash) {
                  res.send({success: true,
                  link: `https://bstlar.com/text/${res.data.link.hash}`,
                  message: "Bypassed with bstlar API! paste type!",
                  type: "bstlar", "type_bstlar":"text",
                  id: new URL(url).pathname,
                  api: "bstlar", apiMessage:"we used bstlar api to bypass!"})
                } else {
                  res.send({"success":false,"message":"failed! the api gived nothing!","type":"bstlar"})
                }
            })
        break;
    case "linkvertise.com": //adfly는 통합
      axios.get(`https://bypass.pm/bypass?link=${enc}`).then(r=>{
        if (r.data.destination) {
          res.send({
            success: true,
            link: r.data.destination,
            message: "bypassed linkvertise with Bypass.pm!",
            api: "bypass.pm",
            apiMessage: "bypassed with bypass.pm!",
            id: new URL(url).pathname,
            type: "linkvertise"
          })
        } else {
          res.send({
            success: false,
            message: "failed to bypass! try using bypass.pm.",
            type: "linkvertise"
          })
        }
      })
      break;
    default:
      res.send({
        success: false,
        message: "unknown link! if you are using linkvertise, you need to provide url starting with 'linkvertise.com'. support email: dittowo@gmail.com",
        api: "unknown",
        type: "unknown",
        id: "unknown"
      })
  }
})

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
