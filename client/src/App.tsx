import React, { useState } from 'react';
import './App.css';

function App() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch('http://localhost:8080/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        })
            .then((res) => res.json())
            .then((data) => setResponse(data.message));
    };
    return (
        <div className='App'>
            <form onSubmit={handleSubmit}>
                <input
                    name='chatting'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></input>
                <button type='submit'>Submit</button>
            </form>
            <div>{response}</div>
        </div>
    );
}

export default App;
