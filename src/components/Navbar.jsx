import React, { useState } from 'react';
import { useAppStore } from '../lib/store';

export default function Navbar() {
  const { 
    activeTab, 
    setActiveTab, 
    profile, 
    setProfile, 
    savedProjects, 
    setSavedDrawerOpen 
  } = useAppStore();

  const [isLevelOpen, setIsLevelOpen] = useState(false);

  const academicLevels = [
    { id: 'UG', label: 'Undergraduate (UG)', desc: 'Working prototype & real utility' },
    { id: 'PG', label: 'Postgraduate (PG)', desc: 'Experimentation, metrics & benchmarking' },
    { id: 'PhD', label: 'Doctorate (PhD)', desc: 'Novel methodology & research gap' }
  ];

  const navLinks = [
    { id: 'discovery', label: 'Problem Discovery' },
    { id: 'why-us', label: 'Why Us' },
    { id: 'health', label: 'Repo Health' },
    { id: 'viva', label: 'Viva Defense' },
    { id: 'docs', label: 'Doc Auditor' },
    { id: 'chat', label: 'AI Mentor' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-[#FAF8F5]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Simple Clean Logo */}
        <div 
          onClick={() => setActiveTab('discovery')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="font-extrabold text-xl tracking-tight text-zinc-900">
            <span className="text-orange-500">Project</span> Scout
          </span>
        </div>

        {/* Clean Center Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Clean Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              const currentKey = localStorage.getItem('project_scout_api_key') || '';
              const newKey = window.prompt("Enter your Google Gemini API Key (or leave empty to use environment default):", currentKey);
              if (newKey !== null) {
                localStorage.setItem('project_scout_api_key', newKey.trim());
                window.location.reload();
              }
            }}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-[11px] font-bold text-zinc-700 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Configure Gemini API Key"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            Gemini Live
          </button>
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <div className="md:hidden flex border-t border-zinc-200 bg-[#FAF8F5] p-2 gap-1 overflow-x-auto no-scrollbar">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`flex-1 min-w-[100px] py-2 px-2 text-xs font-bold rounded-xl text-center shrink-0 whitespace-nowrap ${
                isActive ? 'bg-zinc-900 text-white' : 'text-zinc-600 bg-white border border-zinc-200'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
