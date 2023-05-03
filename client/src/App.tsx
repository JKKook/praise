import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [userInput, setUserInput] = useState('');
    const [gptResponse, setGptResponse] = useState<any>([]);

    const SEVER_URL = 'http://localhost:8000/api/chatgpt';

    const fetchData = async () => {
        const response = await axios.get(SEVER_URL);
        setGptResponse(response.data);
    };

    // GET
    useEffect(() => {
        fetchData();
    }, []);

    // POST
    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        // const user_input = e.target.user_input.value;
        const chatgpt_output = e.target.chat_output.value;
        // const done = e.target.done.value;
        await axios.post(SEVER_URL, { chatgpt_output });
        fetchData();
    };
    return (
        <div className='App'>
            <form onSubmit={handleSubmit}>
                <input
                    name='user_input'
                    // value={userInput}
                    defaultValue={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <input name='chatgpt_output' defaultValue={gptResponse} />
                <button type='submit'>Submit</button>
            </form>
            {gptResponse.map((list: any) => (
                <div key={list.id}>
                    <div>{list.chatgpt_output}</div>
                </div>
            ))}
        </div>
    );
}

export default App;
