// Node 서버 세팅, 리액트 연결
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

require('dotenv').config();

// 노드 데이터를 리액트로 보내기 위한 세팅
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// MonogoDB 연결
const MongoClient = require('mongodb').MongoClient;
// 변수 하나 필요, todoapp이라는 데이터베이스 폴더에 연결
let db;
MongoClient.connect(
    process.env.MONGO_ATLAS_URL,
    { useUnifiedTopology: true },
    // 연결되면 할 일
    (error, client) => {
        if (error) return console.log(error.message);
        db = client.db('chatlist');
        // 생성한 서버를 지정 포트에 열어 줌
        app.listen(8000, () => {
            console.log('node listening on 8000'); // 지정 포트를 열면 보여 줄 부분
        });
    },
);

// Server => Client
let id = 2;
const chatList = [
    {
        id: 1,
        user_input: '칭찬해줘 1',
        chatGpt_output: '그래 칭찬한다 1',
        done: false,
    },
];

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

app.post('/chat', (req, res) => {
    const { user_input, chatGpt_output } = req.body;
    chatList.push({
        id: id++,
        user_input,
        chatGpt_output,
    });
    return res.send('API 데이터 입력 완료');
});

// Root 경로 리액트로 POST 요청 시, 메시지 전달
// input에는 user_input을
// const { Configuration, OpenAIApi } = require('openai');
// const readlineSync = require('readline-sync');
// (async () => {
//     // 구성 및 API 설정
//     const configuration = new Configuration({
//         apiKey: process.env.OPENAI_API_KEY,
//         organization: process.env.OPENAI_ORGANIZATION,
//     });
//     const openai = new OpenAIApi(configuration);
//     // 채팅 기록 남기기
//     const ListOfChatting = [];

//     const defaultMessage = '칭찬 해주세요';
//     // 채팅 루프
//     while (true) {
//         const user_input =
//             readlineSync.question(`오늘의 당신을 칭찬합니다 👍 : `);

//         // 상황에 대한 채팅 기록
//         const orderMessages = [];
//         // 채팅 기록을 반복
//         for (const [userInput, gptOutput] of ListOfChatting) {
//             // role : {user, assistant}, content : {message text}
//             orderMessages.push({ role: 'user', content: userInput });
//             orderMessages.push({ role: 'assistant', content: gptOutput });
//         }

//         // 배열 형태로 반복, user_Input은 메시지 배열에 추가!
//         orderMessages.push({
//             role: 'user',
//             content: user_input + '\u00A0' + `${defaultMessage}`,
//         });

//         try {
//             // AI model
//             const chatGpt = await openai.createChatCompletion({
//                 model: 'gpt-3.5-turbo',
//                 messages: orderMessages,
//                 // max_tokens: 300,
//                 // temperature: 0.2,
//             });

//             // AI 응답
//             // console.log(chatGpt);
//             // console.log(chatGpt.data);
//             // console.log(chatGpt.data.choices);
//             const chatGpt_output = chatGpt.data.choices[0].message.content;

//             console.log(chatGpt_output);

//             ListOfChatting.push([user_input, chatGpt_output]);

//             const user_input_again = readlineSync.question(
//                 '\nWould you like to continue the conversation? (Y/N)',
//             );
//             if (user_input_again.toUpperCase() === 'N') {
//                 return;
//             } else if (user_input_again.toUpperCase() !== 'Y') {
//                 console.log("Invalid input. Please enter 'Y' or 'N'.");
//                 return;
//             }
//         } catch (error) {
//             if (error.response) {
//                 console.log(error.response.status);
//                 console.log(error.response.data);
//             } else {
//                 console.log(error.message);
//             }
//         }
//     }
// })();
