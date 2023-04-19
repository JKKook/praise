// Node 서버 세팅, 리액트 연결
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// OPENAI
// dependencies
const { Configuration, OpenAIApi } = require('openai');
const readlineSync = require('readline-sync'); // 사용자에게 입력 요청
require('dotenv').config();

// 노드 데이터를 리액트로 보내기 위한 세팅
app.use(express.json());
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

app.listen(8080, function () {
    console.log('listening on 8080');
});

// MonogoDB 연결

// Root 페이지를 리액트 build index.html로 설정
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

// Root 경로 리액트로 POST 요청 시, 메시지 전달
// input에는 user_input을
(async () => {
    // 구성 및 API 설정
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
        organization: process.env.OPENAI_ORGANIZATION,
    });
    const openai = new OpenAIApi(configuration);
    // 채팅 기록 남기기
    const ListOfChatting = [];

    const defaultMessage = '칭찬 해주세요';
    // 채팅 루프
    while (true) {
        const user_input =
            readlineSync.question(`오늘의 당신을 칭찬합니다 👍 : `);

        // 상황에 대한 채팅 기록
        const orderMessages = [];
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
            const chatGpt_output = chatGpt.data.choices[0].message.content;

            console.log(chatGpt_output);

            ListOfChatting.push([user_input, chatGpt_output]);

            const user_input_again = readlineSync.question(
                '\nWould you like to continue the conversation? (Y/N)',
            );
            if (user_input_again.toUpperCase() === 'N') {
                return;
            } else if (user_input_again.toUpperCase() !== 'Y') {
                console.log("Invalid input. Please enter 'Y' or 'N'.");
                return;
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
})();
