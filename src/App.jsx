import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProfileBuilder from './components/ProfileBuilder';
import ResearchTicker from './components/ResearchTicker';
import OpportunityCard from './components/OpportunityCard';
import OpportunityDetailModal from './components/OpportunityDetailModal';
import MentorChatModal from './components/MentorChatModal';
import SavedProjectsDrawer from './components/SavedProjectsDrawer';
import { useAppStore } from './lib/store';
import { discoverProjectOpportunities } from './lib/gemini';
import { Compass, Sparkles, RefreshCw, Layers, ShieldCheck, ArrowUpRight, GraduationCap, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const { profile, apiKey, opportunities, setOpportunities, discoveryStatus, setDiscoveryStatus, addResearchLog, clearResearchLogs } = useAppStore();

  const handleLaunchDiscovery = async () => {
    if (discoveryStatus === 'analyzing' || discoveryStatus === 'researching') return;
    
    clearResearchLogs();
    setDiscoveryStatus('analyzing');
    
    // Smooth scroll to ticker
    window.scrollTo({ top: 350, behavior: 'smooth' });

    try {
      const results = await discoverProjectOpportunities(profile, apiKey, addResearchLog);
      setOpportunities(results);
      setDiscoveryStatus('completed');
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
      
      // Auto-scroll to results after 1s
      setTimeout(() => {
        const resultsEl = document.getElementById('discovery-results');
        if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth' });
      }, 800);
    } catch (err) {
      console.error(err);
      setDiscoveryStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 w-full">
        
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-5 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider glow-cyan">
            <Compass className="h-4 w-4 text-cyan-400 animate-spin-slow" />
            <span>Problem Discovery & Opportunity Engine</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15]">
            We don't generate ideas. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              We discover real problems you can solve.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop building generic tutorial clones. Project Scout maps your exact skills and academic level (UG, PG, PhD) against live 2025/2026 web evidence to uncover high-impact project opportunities.
          </p>

          {/* Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs text-slate-300">
            <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/5 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
              <span>Universal Across All Domains</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/5 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
              <span>Live Web & CVE Evidence Grounding</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/5 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
              <span>Grounded AI Engineering Mentor</span>
            </span>
          </div>
        </section>

        {/* Stage 1: Profile Builder Section */}
        <section>
          <ProfileBuilder onStartDiscovery={handleLaunchDiscovery} />
        </section>

        {/* Live Multi-Stage Agentic Research Ticker */}
        <ResearchTicker />

        {/* Stage 2: Discovered Opportunities Results */}
        {opportunities.length > 0 && (
          <section id="discovery-results" className="space-y-6 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">
                    Discovered Real-World Opportunities ({opportunities.length})
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Ranked by multi-dimensional compatibility with your <span className="text-cyan-300 font-semibold">{profile.academicLevel}</span> profile in <span className="text-cyan-300 font-semibold">{profile.domain}</span>.
                </p>
              </div>

              {/* Re-discover Button */}
              <button
                onClick={handleLaunchDiscovery}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/10 transition-all shrink-0 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
                <span>Re-Run Discovery Scan</span>
              </button>
            </div>

            {/* Opportunity Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp, idx) => (
                <OpportunityCard key={opp.id || idx} opportunity={opp} rank={idx + 1} />
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Modals & Drawers */}
      <OpportunityDetailModal />
      <MentorChatModal />
      <SavedProjectsDrawer />

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#070a11] py-6 mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-cyan-400" />
            <span className="font-heading font-semibold text-slate-300">Project Scout</span>
            <span>— PromptWars X Parul University (CSE AIML Edition)</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Powered by Google Gemini 2.5 Flash • Real-Time Discovery Engine
          </div>
        </div>
      </footer>

    </div>
  );
}
