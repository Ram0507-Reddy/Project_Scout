import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, ArrowRight } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { askMentor } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MentorChatModal() {
  const { activeOpportunity, isMentorOpen, setMentorOpen, mentorMessages, addMentorMessage, apiKey } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mentorMessages, isTyping]);

  if (!isMentorOpen || !activeOpportunity) return null;

  const quickPrompts = [
    "How should I structure the system architecture and database?",
    "What are the top 3 technical risks and how do I mitigate them?",
    "Give me a starter code snippet for the core algorithm/API.",
    "How do I explain the novelty of this project in a campus interview?"
  ];

  const handleSend = async (textToSend) => {
    const q = textToSend || input;
    if (!q.trim() || isTyping) return;

    const userMsg = { role: 'user', text: q, time: new Date().toLocaleTimeString() };
    addMentorMessage(userMsg);
    setInput('');
    setIsTyping(true);

    try {
      const answer = await askMentor(activeOpportunity, mentorMessages, q, apiKey);
      const botMsg = { role: 'model', text: answer, time: new Date().toLocaleTimeString() };
      addMentorMessage(botMsg);
    } catch (err) {
      console.error(err);
      addMentorMessage({
        role: 'model',
        text: `Error contacting AI Mentor: ${err.message || 'Rate limit or network error. Please try again.'}`,
        time: new Date().toLocaleTimeString()
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl h-full bg-white border-l border-zinc-200 shadow-2xl flex flex-col justify-between animate-slide-left">
        
        {/* Chat Top Header */}
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-[#2DD4BF] shadow-sm">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-zinc-900">
                  AI Engineering Mentor
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                  Grounded in Project
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 truncate max-w-xs sm:max-w-md">
                Mentoring: <span className="text-zinc-800 font-medium">{activeOpportunity.title}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setMentorOpen(false)}
            className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 text-xs bg-zinc-50/50">
          
          {/* Welcome Intro if empty */}
          {mentorMessages.length === 0 && (
            <div className="p-5 rounded-3xl bg-white border border-zinc-200 space-y-3 shadow-sm animate-fade-in">
              <div className="flex items-center gap-2 text-[#FF5A43] font-bold text-xs">
                <Sparkles className="h-4 w-4" />
                <span>Project-Specific Mentorship Ready</span>
              </div>
              <p className="text-zinc-600 leading-relaxed text-xs">
                I am your dedicated senior engineering mentor for <strong>{activeOpportunity.title}</strong>. Ask me anything from system architecture, starter code in {activeOpportunity.studentOpportunity?.recommendedTechStack?.backend?.[0] || 'Python'}, dataset sources, to defense presentation prep.
              </p>
              <div className="pt-2 text-[11px] text-zinc-500 font-bold">
                Tap any prompt below to get started:
              </div>
              <div className="flex flex-col gap-1.5 pt-1">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(qp)}
                    className="text-left p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 hover:text-zinc-900 text-xs transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>{qp}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation history */}
          {mentorMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              {msg.role !== 'user' && (
                <div className="h-8 w-8 rounded-xl bg-zinc-900 text-[#2DD4BF] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-zinc-900 text-white rounded-br-sm shadow-sm'
                    : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-sm shadow-sm prose max-w-none'
                }`}
              >
                {msg.role === 'user' ? (
                  msg.text
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                )}
                <div className="text-[9px] opacity-60 text-right mt-1.5 font-mono">
                  {msg.time}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="h-8 w-8 rounded-xl bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start items-center text-xs text-zinc-500">
              <div className="h-8 w-8 rounded-xl bg-zinc-900 text-[#2DD4BF] flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A43] animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A43] animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A43] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-zinc-500 ml-1 font-medium">Mentor formulating answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-zinc-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your mentor about architecture, code, or viva tips..."
              className="flex-1 px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-3 rounded-2xl btn-black text-white transition-all shadow-sm disabled:opacity-40 cursor-pointer"
            >
              <Send className="h-4 w-4 text-[#2DD4BF]" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
