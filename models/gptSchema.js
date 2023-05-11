const mongoose = require('mongoose'); // 몽구스 익스프레스 요청
const Schema = mongoose.Schema; // 몽구스에 스키마 생성자 할당

// 채팅시스템의 대한 청사진

const chatSchema = new Schema({
    output: {
        type: String,
    },
});

// modeling
const Chat = mongoose.model('chat', chatSchema);
const chatSchemas = { Chat };

module.exports = chatSchemas;
