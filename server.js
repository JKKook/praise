// 서버를 띄우기 위한 기본 셋팅
const express = require('express');
const app = express();
app.listen(8080, () => {
    console.log('listening on 8080');
});

app.get('/', (req, res) => {
    res.send('open server');
});

// OPENAI
const { Configuration, OpenAIApi } = require('openai');
const readlineSync = require('readline-sync');
require('dotenv').config();

(async () => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
        organization: process.env.OPENAI_ORGANIZATION,
    });
    const openai = new OpenAIApi(configuration);

    const history = [];

    while (true) {
        const user_input = readlineSync.question('오늘의 당신을 칭찬합니다 : ');

        const messages = [];
        for (const [input_text, completion_text] of history) {
            messages.push({ role: 'user', content: input_text });
            messages.push({ role: 'assistant', content: completion_text });
        }

        messages.push({ role: 'user', content: user_input });

        try {
            const completion = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: messages,
                // max_tokens: 300,
                // temperature: 0.2,
            });

            const completion_text = completion.data.choices[0].message.content;
            console.log(completion_text);

            history.push([user_input, completion_text]);

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
