import React, { useState } from 'react';
import { ArrowRight, Bookmark, BookmarkCheck, FileDown, MessageSquare, ShieldAlert, Sparkles, Target, Zap, ExternalLink, CheckCircle2, ChevronRight, BarChart3, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { generateProjectReadme } from '../lib/gemini';
import confetti from 'canvas-confetti';

export default function OpportunityCard({ opportunity, rank }) {
  const { setActiveOpportunity, setMentorOpen, savedProjects, toggleSaveProject } = useAppStore();
  const [showFitBreakdown, setShowFitBreakdown] = useState(false);

  const isSaved = savedProjects.some((p) => p.id === opportunity.id);

  const handleDownloadReadme = (e) => {
    e.stopPropagation();
    const md = generateProjectReadme(opportunity);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${opportunity.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-README.md`;
    a.click();
    URL.revokeObjectURL(url);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
  };

  const handleOpenMentor = (e) => {
    e.stopPropagation();
    setActiveOpportunity(opportunity);
    setMentorOpen(true);
  };

  return (
    <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between group">
      
      {/* Top Header & Fit Score */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono flex items-center justify-center">
              #{rank}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 border border-white/10 text-slate-300">
              {opportunity.domain}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {opportunity.academicLevel} Calibration
            </span>
          </div>

          {/* Project Fit Score Pill with interactive breakdown */}
          <div className="relative">
            <button
              onClick={() => setShowFitBreakdown(!showFitBreakdown)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono hover:border-cyan-400 transition-all cursor-pointer glow-cyan"
            >
              <Zap className="h-3.5 w-3.5 text-cyan-400 fill-cyan-400" />
              <span>{opportunity.projectFitScore}</span>
              <span className="text-[10px] text-slate-400 font-normal">/100 Fit</span>
            </button>

            {/* Fit Score Modal Popover */}
            {showFitBreakdown && (
              <div className="absolute right-0 mt-2 w-64 p-3.5 rounded-2xl glass-panel border border-cyan-500/30 shadow-2xl z-30 text-xs space-y-2 animate-scale-up">
                <div className="flex items-center justify-between font-heading font-bold text-white border-b border-white/10 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Fit Score Matrix</span>
                  </span>
                  <span className="text-cyan-400 font-mono">{opportunity.projectFitScore}%</span>
                </div>
                
                <div className="space-y-1.5 text-[11px]">
                  {Object.entries(opportunity.fitScoreBreakdown || {}).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between text-slate-300 text-[10px] capitalize">
                        <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-mono text-cyan-300">{val}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-white/5">
                  Weighted composite based on your capability profile & problem urgency.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="font-heading font-bold text-lg sm:text-xl text-white tracking-tight leading-snug group-hover:text-cyan-200 transition-colors">
          {opportunity.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          {opportunity.tagline}
        </p>

        {/* Real-World Problem & Evidence Summary */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-[11px]">
            <Target className="h-3.5 w-3.5" />
            <span>The Real-World Problem</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            {opportunity.theProblem?.summary}
          </p>
          
          {/* Live Evidence Badge */}
          {opportunity.theProblem?.evidenceAndSources?.[0] && (
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
              <span className="truncate max-w-[240px]">
                📄 <span className="text-slate-300 font-medium">{opportunity.theProblem.evidenceAndSources[0].title}</span>
              </span>
              <span className="text-cyan-400 font-mono shrink-0">
                {opportunity.theProblem.evidenceAndSources[0].source}
              </span>
            </div>
          )}
        </div>

        {/* "Why Existing Solutions Fail / Don't Build This" */}
        <div className="mt-3 p-3 rounded-xl bg-red-500/5 border border-red-500/15 text-xs text-slate-300 space-y-1">
          <div className="flex items-center gap-1.5 text-red-400 font-semibold text-[11px]">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Existing Solution Gap</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            {opportunity.existingSolutionsGap?.whyTheyFailOrFallShort}
          </p>
        </div>

        {/* Recommended Tech Stack Pill Row */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {Object.values(opportunity.studentOpportunity?.recommendedTechStack || {})
            .flat()
            .slice(0, 5)
            .map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-white/5 text-[10px] font-mono text-slate-300"
              >
                {tech}
              </span>
            ))}
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Save / Bookmark */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveProject(opportunity);
            }}
            className={`p-2 rounded-xl border text-xs transition-all ${
              isSaved
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border-white/10'
            }`}
            title={isSaved ? 'Saved to bookmarks' : 'Save opportunity'}
          >
            {isSaved ? <BookmarkCheck className="h-4 w-4 text-indigo-400" /> : <Bookmark className="h-4 w-4" />}
          </button>

          {/* Export README.md */}
          <button
            onClick={handleDownloadReadme}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs transition-all"
            title="Download GitHub README.md"
          >
            <FileDown className="h-4 w-4" />
          </button>

          {/* Ask AI Mentor */}
          <button
            onClick={handleOpenMentor}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 text-xs font-medium transition-all"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Mentor</span>
          </button>
        </div>

        {/* Deep Dive Modal Trigger */}
        <button
          onClick={() => setActiveOpportunity(opportunity)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white text-xs font-semibold transition-all shadow-md glow-cyan group/btn"
        >
          <span>Explore Blueprint</span>
          <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>

    </div>
  );
}
