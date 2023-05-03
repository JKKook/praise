const mongoose = require('mongoose'); // 몽구스 익스프레스 요청
const Schema = mongoose.Schema; // 몽구스에 스키마 생성자 할당

// 채팅시스템의 대한 청사진
// userInput과 gptOutput으로 정의할 예정

const chatSchema = new Schema({
    input: {
        type: String,
    },
    output: {
        type: String,
    },
});

// modeling
const Chat = mongoose.model('chat', chatSchema);
const chatSchemas = { Chat };

module.exports = chatSchemas;
