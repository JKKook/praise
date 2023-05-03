import axios from 'axios';
import React, { useState } from 'react';

const SERVER_URL = 'http://localhost:8000/api/chatgpt';

// history
let messageHistroy: any[] = [];
let userMessages: any[] = [];
let responseMessages: any[] = [];

function App() {
    const [userInput, setUserInput] = useState('');
    const [output, setOutput] = useState('');

    const handleUserInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const role = userInput ? 'user' : 'assistant';

        const data = {
            userInput: userInput,
            output: output,
            role: role,
        };
        userMessages.push(data.userInput);
        let userInputs = userMessages.push(data.userInput);
        console.log('data', data); // 현재 output은 null

        const response = await axios.post(SERVER_URL, {
            userMessages,
            responseMessages,
        });
        // history 생성
        responseMessages.push(response.data.output);
        let outputs = responseMessages.push(response.data.output);
        //
        setOutput(response.data.output);
        setUserInput('');

        messageHistroy.push(userInputs);
        messageHistroy.push(outputs);

        console.log('history', messageHistroy);

        // 배열 초기화
        userMessages = [];
        // responseMessages = [];
        messageHistroy = [];
    };

    return (
        <div>
            <div>
                <p>{output}</p>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    name='userInput'
                    value={userInput}
                    onChange={handleUserInputChange}
                />
                <button type='submit'>Submit</button>
            </form>
        </div>
    );
}

export default App;
