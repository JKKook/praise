import React from 'react';
import TextInput from '../atom/TextInput';
import TextMonitor from '../atom/TextMonitor';

export default function ChatForm() {
    return (
        <>
            <TextMonitor />
            <TextInput />
        </>
    );
}
