import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { sendMentorChatMessage } from '../lib/mentorEngine';
import { 
  Bot, User, Send, Loader2, RotateCcw 
} from 'lucide-react';

export const MentorChatConsole = () => {
  const { 
    mentorMessages, 
    addMentorMessage, 
    clearMentorMessages, 
    mentorProjectContext, 
    repoData, 
    auditResults,
    setRepoModalOpen
  } = useAppStore();

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mentorMessages, isSending]);

  const handleSend = async (customPrompt = null) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isSending) return;

    const userMessage = { role: 'user', text: textToSend.trim() };
    addMentorMessage(userMessage);
    if (!customPrompt) setInput('');
    setIsSending(true);

    try {
      const responseText = await sendMentorChatMessage(
        [...mentorMessages, userMessage],
        mentorProjectContext,
        repoData || { name: 'Local Project', fileTree: [] },
        auditResults
      );
      addMentorMessage({ role: 'model', text: responseText });
    } catch (err) {
      console.error('Mentor chat error:', err);
      addMentorMessage({ 
        role: 'model', 
        text: `Mentor connection error: ${err.message || 'Failed to generate response'}` 
      });
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    "How should I structure authentication with FastAPI and React?",
    "What quantifiable evaluation metrics will examiners ask for?",
    "Why is our current test coverage a risk in academic review?",
    "How do I explain our project novelty in a campus interview?"
  ];

  if (!repoData) {
    return (
      <div className="flex flex-col h-[650px] rounded-3xl bg-white border border-zinc-200 overflow-hidden shadow-sm items-center justify-center p-10 text-center space-y-4">
        <h3 className="text-base font-extrabold text-zinc-900">AI Mentor Offline</h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Connect your GitHub repository to activate the AI Mentor for continuous code review, architecture guidance, and viva preparation.
        </p>
        <button
          onClick={() => setRepoModalOpen(true)}
          className="px-5 py-2.5 rounded-xl btn-black text-xs font-bold cursor-pointer mt-4"
        >
          Connect Repository
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[650px] rounded-3xl bg-white border border-zinc-200 overflow-hidden shadow-sm">
      
      {/* Console Header */}
      <div className="px-6 py-4 border-b border-zinc-200 bg-[#FAF8F5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-xs font-bold text-zinc-900 flex items-center gap-2">
              Repo-Grounded AI Engineering & Academic Mentor
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                Grounded in {repoData ? `${repoData.owner}/${repoData.name}` : 'Project Context'}
              </span>
            </div>
            <div className="text-[11px] text-zinc-500">
              Aware of your file tree, academic tier ({mentorProjectContext.academicLevel || 'UG'}), and audit findings
            </div>
          </div>
        </div>

        <button
          onClick={clearMentorMessages}
          className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60 rounded-xl transition-colors text-xs flex items-center gap-1 cursor-pointer"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-zinc-50/50">
        {mentorMessages.map((msg, idx) => (
          <div
            key={msg.id || idx}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >

            <div
              className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-zinc-900 text-white rounded-tr-sm'
                  : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-sm space-y-2 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">
                {msg.text}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-zinc-200 border border-zinc-300 flex items-center justify-center text-zinc-700 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isSending && (
          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-white border border-zinc-200 text-xs text-zinc-500 flex items-center gap-2 shadow-sm">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF5A43]" />
              <span>Analyzing repo files and formulating mentor guidance...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      {mentorMessages.length < 3 && (
        <div className="px-6 py-3 bg-[#FAF8F5] border-t border-zinc-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] text-zinc-400 font-bold shrink-0">Ask:</span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:border-zinc-400 transition-all shrink-0 cursor-pointer shadow-sm font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
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
            placeholder="Ask your mentor about architecture, missing tests, code snippets, or viva defense..."
            className="flex-1 px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="p-3 rounded-2xl btn-black disabled:opacity-50 transition-all cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4 text-[#2DD4BF]" />
          </button>
        </form>
      </div>

    </div>
  );
};
