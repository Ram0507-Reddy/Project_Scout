import React, { useState } from 'react';
import { Compass, Bookmark, Key, Sparkles, CheckCircle2, ChevronDown, GraduationCap, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../lib/store';

export default function Navbar() {
  const { profile, setProfile, savedProjects, setSavedDrawerOpen, apiKey, setApiKey } = useAppStore();
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const academicLevels = [
    { id: 'UG', label: 'Undergraduate (UG)', desc: 'Working prototype & real utility' },
    { id: 'PG', label: 'Postgraduate (PG)', desc: 'Experimentation, metrics & benchmarking' },
    { id: 'PhD', label: 'Doctorate (PhD)', desc: 'Novel methodology & research gap' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#090d16]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-[1px] flex items-center justify-center glow-cyan shadow-lg">
            <div className="h-full w-full bg-[#090d16] rounded-[11px] flex items-center justify-center">
              <Compass className="h-5 w-5 text-cyan-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                PROJECT SCOUT
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">
                AI Discovery
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Problem → Capability → Evidence-Backed Opportunity
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Academic Level Pill Selector */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-white/10 text-xs font-medium text-slate-200 transition-all">
              <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
              <span>{profile.academicLevel}</span>
              <span className="text-[10px] text-slate-400 font-normal">Level</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
            <div className="absolute right-0 mt-2 w-64 p-1.5 rounded-xl glass-panel hidden group-hover:block transition-all shadow-2xl z-50">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-1">
                Calibrate Academic Depth
              </div>
              {academicLevels.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setProfile({ academicLevel: lvl.id })}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-start gap-2 ${
                    profile.academicLevel === lvl.id
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30'
                      : 'hover:bg-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="mt-0.5">
                    {profile.academicLevel === lvl.id ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border border-slate-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{lvl.label}</div>
                    <div className="text-[10px] text-slate-400">{lvl.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* API Key Status */}
          <button
            onClick={() => setIsKeyModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              apiKey
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 animate-pulse'
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{apiKey ? 'Gemini Connected' : 'Set API Key'}</span>
          </button>

          {/* Saved Projects Drawer Button */}
          <button
            onClick={() => setSavedDrawerOpen(true)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 text-xs font-medium transition-all"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Saved</span>
            {savedProjects.length > 0 && (
              <span className="h-4 min-w-4 px-1 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">
                {savedProjects.length}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* API Key Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl glass-panel border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-white">Google Gemini API Key</h3>
                <p className="text-xs text-slate-400">Used for real-time problem discovery and AI mentorship</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                API Key
              </label>
              <input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="Enter AI Studio API Key..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Keys are stored locally in your browser session. Never sent to third parties.</span>
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsKeyModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setApiKey(tempKey);
                  setIsKeyModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 transition-all shadow-lg glow-cyan"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
