import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Message } from '../types';

const INITIAL_MESSAGES: Message[] = [
  { id: '1', sender: 'System', role: 'engineer', content: 'Session 4 telemetry sync complete.', timestamp: '10:00 AM' },
  { id: '2', sender: 'Hiroshi T.', role: 'manager', content: 'Rear wing downforce numbers look low in Sector 2.', timestamp: '10:05 AM' },
  { id: '3', sender: 'Mike R.', role: 'engineer', content: 'Copy that. Adjusting simulation parameters for the next run.', timestamp: '10:07 AM' },
];

const TeamComms: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      role: 'engineer',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex-1 p-8 h-full flex flex-col">
      <div className="mb-6">
          <h2 className="text-2xl font-light text-white tracking-tight">Team Comms</h2>
          <p className="text-zinc-500 text-xs mt-1 font-mono uppercase">CHANNEL: #ENGINEERING-MAIN • ENCRYPTED</p>
      </div>
      
      <div className="flex-1 glass-panel rounded-xl overflow-hidden flex flex-col border border-white/5">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/20">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.sender === 'You' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'System' ? 'bg-isuzu-red/20 text-isuzu-red' : 'bg-zinc-800 text-zinc-400'}`}>
                        {msg.sender === 'System' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className={`max-w-[70%] space-y-1 ${msg.sender === 'You' ? 'items-end flex flex-col' : ''}`}>
                        <div className="flex items-center gap-2">
                             <span className="text-xs font-bold text-zinc-300">{msg.sender}</span>
                             <span className="text-[10px] text-zinc-600">{msg.timestamp}</span>
                        </div>
                        <div className={`p-3 rounded-lg text-sm font-light leading-relaxed border ${
                            msg.sender === 'You' 
                            ? 'bg-isuzu-red/10 border-isuzu-red/20 text-white rounded-tr-none' 
                            : 'bg-[#1a1a1a] border-white/5 text-zinc-300 rounded-tl-none'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="p-4 bg-[#0a0a0a] border-t border-white/10">
            <div className="flex gap-3 relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message to engineering..."
                    className="flex-1 bg-zinc-900/50 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-isuzu-red/50 transition-colors placeholder:text-zinc-700"
                />
                <button 
                    onClick={handleSend}
                    className="absolute right-2 top-1.5 p-1.5 bg-isuzu-red text-white rounded hover:bg-red-600 transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TeamComms;