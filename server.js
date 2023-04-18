// 서버를 띄우기 위한 기본 셋팅
const express = require('express'); // 라이    브러리 사용
const app = express(); // 라이브러리를 사용해서 서버 생성
// 생성한 서버를 지정 포트에 열어 줌
app.listen(8080, () => {
    console.log('listening on 8080'); // 지정 포트를 열면 보여 줄 부분
});

app.get('/', (req, res) => {
    res.send('open server');
});
