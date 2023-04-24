import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [chatList, setChatList] = useState<any>([]);

    const SEVER_URL = 'http://localhost:8000/chat';

    const fetchData = async () => {
        const response = await axios.get(SEVER_URL);
        setChatList(response.data);
    };

    // GET
    useEffect(() => {
        fetchData();
    }, []);

    // POST

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user_input = e.target.user_input.value;
        const chatgpt_output = e.target.chat_output.value;
        const done = e.target.done.value;
        await axios.post(SEVER_URL, { user_input, chatgpt_output, done });
        fetchData();
    };
    return (
        <div className='App'>
            <form onSubmit={handleSubmit}>
                <input name='user_input' />
                <input name='chatgpt_output' />
                <input name='done' value='추가' />
                <button type='submit'>Submit</button>
            </form>
            {chatList.map((list: any) => (
                <div key={list.id}>
                    <div>{list.id}</div>
                    <div>{list.user_input}</div>
                    <div>{list.chatgpt_output}</div>
                    <div>{list.done ? 'Y' : 'N'}</div>
                </div>
            ))}
        </div>
    );
}

export default App;
