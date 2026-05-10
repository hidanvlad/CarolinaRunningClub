import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBi3m8n490k0t82CTXH4UD25Thzw3VmQOk",
    authDomain: "carolinarunningchat.firebaseapp.com",
    databaseURL: "https://carolinarunningchat-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "carolinarunningchat",
    storageBucket: "carolinarunningchat.firebasestorage.app",
    messagingSenderId: "842725740425",
    appId: "1:842725740425:web:62405ddb3ed9b9eab41b58",
    measurementId: "G-2NM6JG2R97"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const Chat = ({ currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    // Instagram-style auto-scroll to the newest message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const messagesRef = ref(db, 'messages');
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list = Object.values(data);
                // Sort by timestamp to ensure chronological order
                setMessages(list.sort((a, b) => a.timestamp - b.timestamp));
            }
        });
        return () => unsubscribe();
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        await push(ref(db, 'messages'), {
            user: currentUser,
            text: input,
            timestamp: Date.now()
        });
        setInput('');
    };

    return (
        <div style={chatStyles.container}>
            {/* Scrollable Message Area */}
            <div style={chatStyles.messagesArea} ref={scrollRef}>
                {messages.map((m, i) => {
                    const isMe = m.user === currentUser;
                    const initials = m.user.split(' ').map(n => n[0]).join('');

                    return (
                        <div key={i} style={{
                            ...chatStyles.messageRow,
                            flexDirection: isMe ? 'row-reverse' : 'row'
                        }}>
                            {/* Initials Avatar */}
                            <div style={{
                                ...chatStyles.avatar,
                                backgroundColor: isMe ? '#444' : '#8B0000'
                            }}>
                                {initials}
                            </div>

                            <div style={{
                                ...chatStyles.bubbleWrapper,
                                alignItems: isMe ? 'flex-end' : 'flex-start'
                            }}>
                                {/* Subtle Username above bubble if it's someone else */}
                                {!isMe && <span style={chatStyles.senderName}>{m.user}</span>}

                                <div style={{
                                    ...chatStyles.bubble,
                                    backgroundColor: isMe ? '#8B0000' : '#262626',
                                    borderRadius: isMe ? '22px 22px 4px 22px' : '22px 22px 22px 4px'
                                }}>
                                    <div style={chatStyles.text}>{m.text}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Instagram-style Pill Input Bar */}
            <form onSubmit={sendMessage} style={chatStyles.form}>
                <div style={chatStyles.inputWrapper}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Message..."
                        style={chatStyles.input}
                    />
                    <button
                        type="submit"
                        style={{
                            ...chatStyles.sendBtn,
                            opacity: input.trim() ? 1 : 0.4
                        }}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

const chatStyles = {
    container: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#121212',
    },
    messagesArea: {
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        scrollbarWidth: 'none', // Keeps it clean like a mobile app
    },
    messageRow: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '10px',
        marginBottom: '2px'
    },
    avatar: {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 'bold',
        color: 'white',
        flexShrink: 0,
        marginBottom: '2px'
    },
    bubbleWrapper: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '75%'
    },
    senderName: {
        fontSize: '10px',
        color: '#666',
        marginLeft: '12px',
        marginBottom: '2px'
    },
    bubble: {
        padding: '10px 18px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    },
    text: {
        color: '#fff',
        fontSize: '14px',
        lineHeight: '1.4',
        wordBreak: 'break-word'
    },
    form: {
        padding: '15px 20px',
        backgroundColor: '#121212',
        borderTop: '1px solid #262626'
    },
    inputWrapper: {
        display: 'flex',
        backgroundColor: '#121212',
        border: '1px solid #363636',
        borderRadius: '30px',
        padding: '4px 15px',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        background: 'none',
        border: 'none',
        color: 'white',
        padding: '10px',
        outline: 'none',
        fontSize: '14px'
    },
    sendBtn: {
        background: 'none',
        border: 'none',
        color: '#FF4D4D',
        fontWeight: 'bold',
        cursor: 'pointer',
        padding: '0 10px',
        fontSize: '14px',
        transition: 'opacity 0.2s'
    }
};

export default Chat;