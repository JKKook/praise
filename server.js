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

app.get('/chat', (req, res) => {
    res.json(chatList);
});

// app.post('/chat', async (req, res) => {
//     const { input, output} = req.body;
//     db.insertOne({
//         user_input : userInput,
//         chatGpt_output : gptResponse,
//     });
//     return res.send('API 데이터 입력 완료');
// });

// Root 경로 리액트로 POST 요청 시, 메시지 전달
// input에는 user_input을
const { Configuration, OpenAIApi } = require('openai');
const readlineSync = require('readline-sync');
const { Chat } = require('./models/chatSchema');

// 구성 및 API 설정
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION,
});
const openai = new OpenAIApi(configuration);

app.post('/api/chatgpt', async (req, res) => {
    const chat = new Chat(req.body);
    const isChatRequest = await chat.save();
    // 채팅 기록 남기기
    const ListOfChatting = [];
    const defaultMessage = '칭찬 해주세요';
    // 채팅 루프
    while (isChatRequest) {
        console.log(isChatRequest);
        const user_input =
            readlineSync.question(`오늘의 당신을 칭찬합니다 👍 : `);

        // 상황에 대한 채팅 기록
        let orderMessages = [];
        // 채팅 기록을 반복
        for (const [userInput, gptOutput] of ListOfChatting) {
            // role : {user, assistant}, content : {message text}
            orderMessages.push({ role: 'user', content: userInput });
            orderMessages.push({ role: 'assistant', content: gptOutput });
        }

        // 배열 형태로 반복, user_Input은 메시지 배열에 추가!
        orderMessages.push({
            role: 'user',
            content: user_input + '\u00A0' + `${defaultMessage}`,
        });

        try {
            // AI model
            const chatGpt = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: orderMessages,
                // max_tokens: 300,
                // temperature: 0.2,
            });

            // AI 응답
            // console.log(chatGpt);
            // console.log(chatGpt.data);
            // console.log(chatGpt.data.choices);
            if (chatGpt.data) {
                gptResponse = chatGpt.data.choices[0].message.content;
                console.log(gptResponse);
                res.json({ message: gptResponse });

                //
                ListOfChatting.push([user_input, gptResponse]);

                //
                // const user_input_again = readlineSync.question(
                //     '\nWould you like to continue the conversation? (Y/N)',
                // );
                // if (user_input_again.toUpperCase() === 'N') {
                //     return;
                // } else if (user_input_again.toUpperCase() !== 'Y') {
                //     console.log("Invalid input. Please enter 'Y' or 'N'.");
                //     return;
                // }
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            } else {
                console.log(error.message);
            }
        }
    }
});

app.listen(PORT, () => {
    console.log(`Sever is running on port ${PORT}`);
});
