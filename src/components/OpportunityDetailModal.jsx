import React, { useState } from 'react';
import { X, Target, AlertTriangle, Cpu, Layers, Calendar, Briefcase, FileDown, MessageSquare, Bookmark, BookmarkCheck, CheckCircle2, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { generateProjectReadme } from '../lib/gemini';
import confetti from 'canvas-confetti';

export default function OpportunityDetailModal() {
  const { activeOpportunity, setActiveOpportunity, setMentorOpen, savedProjects, toggleSaveProject } = useAppStore();
  const [activeTab, setActiveTab] = useState('problem'); // 'problem' | 'solution' | 'roadmap' | 'defense'

  if (!activeOpportunity) return null;

  const isSaved = savedProjects.some((p) => p.id === activeOpportunity.id);

  const handleDownloadReadme = () => {
    const md = generateProjectReadme(activeOpportunity);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeOpportunity.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-README.md`;
    a.click();
    URL.revokeObjectURL(url);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
  };

  const handleOpenMentor = () => {
    setMentorOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl glass-panel border border-white/15 shadow-2xl overflow-hidden relative animate-scale-up my-auto">
        
        {/* Modal Top Header */}
        <div className="p-6 sm:p-7 border-b border-white/10 flex items-start justify-between gap-4 bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {activeOpportunity.domain}
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10">
                {activeOpportunity.academicLevel} Standard
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-400 bg-cyan-500/15 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                <Zap className="h-3 w-3 fill-cyan-400" />
                {activeOpportunity.projectFitScore}/100 Fit Score
              </span>
            </div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight">
              {activeOpportunity.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {activeOpportunity.tagline}
            </p>
          </div>

          <button
            onClick={() => setActiveOpportunity(null)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/10 transition-all shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 bg-slate-900/30 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'problem', label: '1. Problem & Evidence', icon: <Target className="h-3.5 w-3.5" /> },
            { id: 'solution', label: '2. Solution & Architecture', icon: <Cpu className="h-3.5 w-3.5" /> },
            { id: 'roadmap', label: '3. Roadmap & Milestones', icon: <Calendar className="h-3.5 w-3.5" /> },
            { id: 'defense', label: '4. Resume & Defense Pack', icon: <Briefcase className="h-3.5 w-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm">
          
          {/* TAB 1: Problem & Evidence */}
          {activeTab === 'problem' && (
            <div className="space-y-6 animate-fade-in">
              {/* Problem Description */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
                <div className="font-heading font-bold text-sm text-amber-300 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>The Grounded Real-World Problem</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                  {activeOpportunity.theProblem?.summary}
                </p>
                <div className="pt-2 border-t border-white/5 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Who is affected: </span>
                  {activeOpportunity.theProblem?.affectedPopulation}
                </div>
              </div>

              {/* Evidence & Why Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2.5">
                  <div className="font-heading font-bold text-xs text-cyan-300">
                    🕒 Why Now? (2025/2026 Drivers)
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {activeOpportunity.theProblem?.whyNow?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2.5">
                  <div className="font-heading font-bold text-xs text-blue-300">
                    📑 Evidence & Reports Discovered
                  </div>
                  <div className="space-y-2.5">
                    {activeOpportunity.theProblem?.evidenceAndSources?.map((ev, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs">
                        <div className="font-semibold text-slate-200">{ev.title}</div>
                        <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{ev.source} ({ev.date})</div>
                        <div className="text-[11px] text-slate-400 mt-1">"{ev.finding}"</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Existing Solutions & Warning */}
              <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-3">
                <div className="font-heading font-bold text-xs text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Existing Solutions & The Critical Gap ("Don't Build This")</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <p><strong className="text-slate-200">Current market tools:</strong> {activeOpportunity.existingSolutionsGap?.existingWork}</p>
                  <p><strong className="text-slate-200">Why they fall short:</strong> {activeOpportunity.existingSolutionsGap?.whyTheyFailOrFallShort}</p>
                </div>
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-[11px] text-red-200">
                  <strong>⚠️ Pitfall Warning:</strong> {activeOpportunity.existingSolutionsGap?.dontBuildThisWarning}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Solution & Architecture */}
          {activeTab === 'solution' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
                <div className="font-heading font-bold text-sm text-cyan-300 flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  <span>The Proposed Solution</span>
                </div>
                <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
                  {activeOpportunity.studentOpportunity?.coreConcept}
                </p>
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200">
                  <strong>Why your profile fits:</strong> {activeOpportunity.studentOpportunity?.whyStudentIsSuited}
                </div>
              </div>

              {/* System Architecture Box */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
                <div className="font-heading font-bold text-xs text-slate-200">
                  🏗️ High-Level System Architecture
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 border border-white/10 text-cyan-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                  {activeOpportunity.studentOpportunity?.solutionArchitecture}
                </pre>
              </div>

              {/* Tech Stack Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
                <div className="font-heading font-bold text-xs text-slate-200">
                  🛠️ Recommended Technology Stack
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(activeOpportunity.studentOpportunity?.recommendedTechStack || {}).map(([layer, techs]) => (
                    <div key={layer} className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                      <div className="text-[10px] uppercase font-bold text-slate-400 capitalize">{layer}</div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {techs.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 border border-white/10 text-[10px] font-mono text-cyan-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Roadmap & Milestones */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-xs text-slate-400">
                A staged week-by-week implementation plan structured to guarantee working deliverables at every stage.
              </div>
              <div className="space-y-3">
                {activeOpportunity.developmentRoadmap?.map((phase, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-start gap-4">
                    <div className="px-3 py-1.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs shrink-0 mt-0.5">
                      {phase.phase}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-white">{phase.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{phase.deliverables}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Resume & Defense Pack */}
          {activeTab === 'defense' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
                <div className="font-heading font-bold text-xs text-emerald-300 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Resume / CV Bullet Points</span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-300 font-mono">
                    • {activeOpportunity.careerAndResumePack?.resumeBullet1}
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-300 font-mono">
                    • {activeOpportunity.careerAndResumePack?.resumeBullet2}
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
                <div className="font-heading font-bold text-xs text-indigo-300">
                  🎯 Interview Elevator Pitch (How to defend this project)
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
                  "{activeOpportunity.careerAndResumePack?.interviewTalkingPoint}"
                </p>
              </div>

              {activeOpportunity.careerAndResumePack?.potentialResearchPaperAngle && (
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
                  <div className="font-heading font-bold text-xs text-purple-300">
                    🔬 Publication & Research Paper Angle
                  </div>
                  <p className="text-xs text-purple-200">
                    {activeOpportunity.careerAndResumePack.potentialResearchPaperAngle}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-white/10 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveProject(activeOpportunity)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                isSaved
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                  : 'bg-slate-800 text-slate-300 hover:text-white border-white/10'
              }`}
            >
              {isSaved ? <BookmarkCheck className="h-4 w-4 text-indigo-400" /> : <Bookmark className="h-4 w-4" />}
              <span>{isSaved ? 'Saved' : 'Save to Projects'}</span>
            </button>

            <button
              onClick={handleDownloadReadme}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all"
            >
              <FileDown className="h-4 w-4" />
              <span>Export README.md</span>
            </button>
          </div>

          <button
            onClick={handleOpenMentor}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white text-xs font-semibold transition-all shadow-lg glow-cyan"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Open AI Mentor Chat</span>
          </button>
        </div>

      </div>
    </div>
  );
}
