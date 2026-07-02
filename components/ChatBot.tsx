'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
}

const SUGGESTED_PROMPTS = [
  'What is his hometown?',
  'What tech stack do he use?',
  'Tell me about his education',
];

// --- Lightweight markdown renderer (bold + numbered/bulleted lists) ---
// Avoids pulling in a full markdown library for a small chat widget.
function renderContent(text: string) {
  const lines = text.split('\n').filter(l => l.trim() !== '');

  const renderInline = (line: string, key: number) => {
    const parts = line.split(/(\*\*.*?\*\*)/g).filter(Boolean);
    return (
      <span key={key}>
        {parts.map((part, i) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={i} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  // Detect "1. text" style numbered lines and group them into an <ol>
  const isNumbered = (l: string) => /^\d+\.\s+/.test(l.trim());

  const blocks: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    if (isNumbered(lines[i])) {
      const items: string[] = [];
      while (i < lines.length && isNumbered(lines[i])) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push(
        <ol key={i} className="list-decimal list-inside space-y-1 my-1">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item, idx)}
            </li>
          ))}
        </ol>
      );
    } else {
      blocks.push(
        <p key={i} className="leading-relaxed">
          {renderInline(lines[i], i)}
        </p>
      );
      i++;
    }
  }

  return <div className="space-y-1">{blocks}</div>;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  const [sessionKey] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    const saved = localStorage.getItem('portfolio_chat_session');
    if (saved) return saved;
    const id = `session_${crypto.randomUUID()}`;
    localStorage.setItem('portfolio_chat_session', id);
    return id;
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      textareaRef.current?.focus();
    }
  }, [isOpen]);

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading || !sessionKey) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    };

    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated, sessionId: sessionKey }),
      });

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'model',
          content: data.reply ?? 'No response',
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'model',
          content: 'Something went wrong. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* ---------- Chat Panel ---------- */}
      <div
        className={`
          w-[92vw] max-w-sm sm:w-96
          bg-[#0B0F1A] border border-white/10
          rounded-3xl shadow-2xl shadow-black/50
          overflow-hidden
          origin-bottom-right
          transition-all duration-300 ease-out
          ${isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-600/20 via-violet-600/20 to-purple-600/20 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                K
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-[#0B0F1A]" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">
                Ask about Kyaw
              </p>
              <p className="text-slate-400 text-xs font-mono">online</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="px-4 py-4 h-[420px] overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 px-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center">
                <Sparkles size={20} className="text-violet-300" />
              </div>
              <p className="text-slate-400 text-sm">
                Ask me anything about Kyaw Myo Aung — background, skills, or projects.
              </p>
              <div className="flex flex-col gap-2 w-full">
                {SUGGESTED_PROMPTS.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-left text-xs text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-[10px] text-white font-semibold">
                  K
                </div>
              )}
              <div className="flex flex-col gap-1 max-w-[78%]">
                <div
                  className={`
                    px-4 py-2.5 text-sm
                    ${msg.role === 'user'
                      ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl rounded-br-md'
                      : 'bg-[#141827] text-slate-100 border border-white/10 rounded-2xl rounded-bl-md'}
                  `}
                >
                  {renderContent(msg.content)}
                </div>
                <span
                  className={`text-[10px] font-mono text-slate-500 px-1 ${
                    msg.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {formatTime(new Date())}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-[10px] text-white font-semibold">
                K
              </div>
              <div className="bg-[#141827] border border-white/10 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 p-3 border-t border-white/10 bg-[#0B0F1A]"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="> Ask something..."
            rows={1}
            className="flex-1 resize-none rounded-2xl px-4 py-2.5 bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500 outline-none focus:border-violet-500/50 transition-colors font-mono max-h-24"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* ---------- Floating Launcher Button ---------- */}
      <button
      onClick={() => {
        setIsOpen(prev => !prev);
        setHasOpenedOnce(true); 
          }}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 text-white shadow-lg shadow-violet-900/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        {!hasOpenedOnce && (
          <span className="absolute inset-0 rounded-full bg-violet-500 animate-ping opacity-40" />
        )}
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}