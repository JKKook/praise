// 서버를 띄우기 위한 기본 셋팅
const express = require('express');
const app = express();
app.listen(8080, () => {
    console.log('listening on 8080');
});

app.get('/', (req, res) => {
    res.send('open server');
});
