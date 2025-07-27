import React, { useState } from 'react';
import { api } from '../../utils/api';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi Buyer! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setLoading(true);
    try {
      const { data } = await api.post(
        '/chatbot',
        {
          messages: [
            { role: 'user', content: input }
          ]
        }
      );
      setMessages(msgs => [...msgs, { from: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { from: 'bot', text: 'Sorry, something went wrong.' }]);
    }
    setInput('');
    setLoading(false);
  };

  // Floating button to open chatbot
  if (!open) {
  return (
    <div
      onClick={() => setOpen(true)}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        background: 'linear-gradient(135deg, #a5b4fc 60%, #818cf8 100%)',
        color: '#fff',
        borderRadius: '40px 40px 40px 60px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        padding: '16px 28px',
        fontWeight: 'bold',
        fontSize: 18,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minWidth: 140,
        userSelect: 'none'
      }}
      aria-label="Open Chatbot"
    >
      <span role="img" aria-label="chat">💬</span>
      Chat with us
    </div>
  );
}

  // Chatbot UI
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, width: 320, background: '#fff',
      borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: '1px solid #eee', fontWeight: 'bold', background: '#4f46e5', color: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
        Buyer Chatbot
        <button
          onClick={() => setOpen(false)}
          style={{
            background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer'
          }}
          aria-label="Close Chatbot"
        >
          ×
        </button>
      </div>
      <div style={{ maxHeight: 300, overflowY: 'auto', padding: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.from === 'user' ? 'right' : 'left',
            margin: '8px 0'
          }}>
            <span style={{
              display: 'inline-block',
              background: msg.from === 'user' ? '#e0e7ff' : '#f3f4f6',
              color: '#111',
              borderRadius: 12,
              padding: '8px 12px',
              maxWidth: 220
            }}>{msg.text}</span>
          </div>
        ))}
        {loading && <div style={{ color: '#888', fontSize: 12 }}>Bot is typing...</div>}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', borderTop: '1px solid #eee' }}>
        <input
          style={{ flex: 1, border: 'none', padding: 12, borderBottomLeftRadius: 16, outline: 'none' }}
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" style={{ padding: '0 16px', background: 'none', border: 'none', color: '#4f46e5', fontWeight: 'bold' }} disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}