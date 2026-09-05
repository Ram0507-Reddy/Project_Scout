import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, Code2, ShieldAlert, Cpu, ArrowRight, CornerDownLeft } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl h-full bg-[#090d16]/95 border-l border-white/10 shadow-2xl flex flex-col justify-between animate-slide-left">
        
        {/* Chat Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] flex items-center justify-center glow-cyan shadow-md">
              <div className="h-full w-full bg-[#090d16] rounded-[11px] flex items-center justify-center">
                <Bot className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm text-white">
                  AI Engineering Mentor
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Grounded in Project
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                Mentoring: <span className="text-slate-200">{activeOpportunity.title}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setMentorOpen(false)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/10 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Welcome Intro if empty */}
          {mentorMessages.length === 0 && (
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-cyan-400 font-heading font-bold text-xs">
                <Sparkles className="h-4 w-4" />
                <span>Project-Specific Mentorship Ready</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                I am your dedicated senior engineering mentor for <strong>{activeOpportunity.title}</strong>. Ask me anything from system architecture, starter code in {activeOpportunity.studentOpportunity?.recommendedTechStack?.backend?.[0] || 'Python'}, dataset sources, to defense presentation prep.
              </p>
              <div className="pt-2 text-[11px] text-slate-400">
                Tap any prompt below to get started:
              </div>
              <div className="flex flex-col gap-1.5 pt-1">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(qp)}
                    className="text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white text-xs transition-all flex items-center justify-between group"
                  >
                    <span>{qp}</span>
                    <ArrowRight className="h-3 w-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                <div className="h-7 w-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-3.5 w-3.5" />
                </div>
              )}
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-sm shadow-md'
                    : 'bg-slate-900/80 border border-white/10 text-slate-200 rounded-bl-sm prose prose-invert max-w-none'
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
                <div className="h-7 w-7 rounded-lg bg-blue-600/30 border border-blue-400/30 text-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start items-center text-xs text-slate-400">
              <div className="h-7 w-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shrink-0">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-900 border border-white/5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-400 ml-1">Mentor formulating answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80">
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
              placeholder="Ask your mentor about architecture, code, or interview tips..."
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 transition-all shadow-md glow-cyan disabled:opacity-40 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
