const mongoose = require('mongoose'); // 몽구스 익스프레스 요청
const Schema = mongoose.Schema; // 몽구스에 스키마 생성자 할당

// 채팅시스템의 대한 청사진
// userInput과 gptOutput으로 정의할 예정

const userSchema = new Schema({
    // userId: {
    //     type: Schema.Types.ObjectId, // ObjectId 타입으로 정의
    //     required: true,
    //     unique: true,
    // },

    input: {
        type: String,
    },
});

// modeling
const User = mongoose.model('user', userSchema);
const userSchemas = { User };

module.exports = userSchemas;
