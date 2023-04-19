// Node 서버 세팅, 리액트 연결
const express = require('express');
const path = require('path');
const app = express();

app.listen(8080, function () {
    console.log('listening on 8080');
});

app.use(express.json());
const cors = require('cors');
app.use(cors());

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// React Router 이용 시, Node에서 라우팅해도 됨!
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// DB에 있는 자료 리액트로 보내줄 때,
// 리액트에서 필요한 데이터 경로로 GET / POST 요청하면 됨.
app.get('/product', (req, res) => {
    res.json({ name: 'black shoes' });
});
