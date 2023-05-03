// Node 서버 세팅, 리액트 연결
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const PORT = 8000;

require('dotenv').config();

// 노드 데이터를 리액트로 보내기 위한 세팅
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// MonogoDB 연결
// 변수 하나 필요, todoapp이라는 데이터베이스 폴더에 연결
mongoose
    .connect(process.env.MONGO_ATLAS_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => {
        console.log('DB connected');
    })
    .catch((err) => {
        console.log(err);
    });

// Server => Client request

// Root 페이지를 리액트 build index.html로 설정
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// React Router 이용 시, Node에서 라우팅해도 됨!
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client/build/index.html'));
// });

// Root 경로 리액트로 POST 요청 시, 메시지 전달
// input에는 user_input을
const { Configuration, OpenAIApi } = require('openai');
const readlineSync = require('readline-sync');
const { Chat } = require('./models/chatSchema');
const { systemContent } = require('./utils/systemContent');

// 구성 및 API 설정
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION,
});
const openai = new OpenAIApi(configuration);

// chat history 가져오기
app.get('/chat', async (req, res) => {
    try {
        const chatHistory = await Chat.find();
        res.json(chatHistory);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

// chat 데이터 저장하기
app.post('/api/chatgpt', async (req, res) => {
    const { userMessages, responseMessages, messageHistroy } = req.body;
    // console.log(userMessages);
    // console.log(responseMessages);
    // console.log(messageHistroy);

    let messageOptions = [
        { role: 'system', content: systemContent.setting },
        // { role: 'user', content: systemContent.setting },
        { role: 'assistant', content: systemContent.default },
    ];

    while (userMessages.length != 0 || responseMessages.length != 0) {
        if (userMessages.length != 0) {
            // Chat 모델을 이용하여 userMessages를 저장합니다.
            const chatInput = new Chat({
                input: userMessages.shift().replace(/\n/g, ''),
            });
            await chatInput.save();

            messageOptions.push(
                JSON.parse(
                    '{"role" : "user", "content" : "' +
                        String(chatInput.input) +
                        '"}',
                ),
            );
        }
        if (responseMessages.length != 0) {
            // Chat 모델을 이용하여 responseMessages를 저장합니다.
            const chatOutput = new Chat({
                output: responseMessages.shift().replace(/\n/g, ''),
            });
            await chatOutput.save();

            messageOptions.push(
                JSON.parse(
                    '{"role" : "assistant", "content" : "' +
                        String(chatOutput.output) +
                        '"}',
                ),
            );
        }
    }

    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messageOptions,
        temperature: 1,
        top_p: 0.8,
    });
    let response = completion.data.choices[0].message['content'];
    res.json({ output: response });
});

app.listen(PORT, () => {
    console.log(`Sever is running on port ${PORT}`);
});
