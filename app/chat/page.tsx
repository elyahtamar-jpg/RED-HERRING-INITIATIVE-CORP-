'use client';

import { useChat } from '@ai-sdk/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
      <h1>RHIC Civil Justice AI</h1>

      <div
        style={{
          border: '1px solid #ccc',
          height: '400px',
          overflowY: 'auto',
          padding: '12px',
          marginBottom: '12px',
        }}
      >
        {messages.map(m => (
          <p key={m.id}>
            <strong>{m.role === 'user' ? 'You' : 'RHIC AI'}:</strong>{' '}
            {m.content}
          </p>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about civil rights or 18 U.S.C. § 242…"
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
        />
        <button type="submit">Send</button>
      </form>
    </main>
  );
}
