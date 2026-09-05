import React from 'react';
import { X, Bookmark, FileDown, Trash2, ArrowRight, ExternalLink, Zap } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { generateProjectReadme } from '../lib/gemini';
import confetti from 'canvas-confetti';

export default function SavedProjectsDrawer() {
  const { isSavedDrawerOpen, setSavedDrawerOpen, savedProjects, toggleSaveProject, setActiveOpportunity } = useAppStore();

  if (!isSavedDrawerOpen) return null;

  const handleDownloadReadme = (opportunity, e) => {
    e.stopPropagation();
    const md = generateProjectReadme(opportunity);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${opportunity.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-README.md`;
    a.click();
    URL.revokeObjectURL(url);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md h-full bg-[#090d16]/95 border-l border-white/10 shadow-2xl flex flex-col justify-between animate-slide-left">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <Bookmark className="h-5 w-5 text-indigo-400" />
            <h3 className="font-heading font-bold text-base text-white">
              Saved Project Opportunities ({savedProjects.length})
            </h3>
          </div>
          <button
            onClick={() => setSavedDrawerOpen(false)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/10 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5 text-xs">
          {savedProjects.length === 0 ? (
            <div className="text-center py-16 text-slate-500 space-y-3">
              <Bookmark className="h-10 w-10 mx-auto opacity-30 text-indigo-400" />
              <p>No opportunities saved yet.</p>
              <p className="text-[11px] text-slate-600">
                Click the bookmark icon on any discovered opportunity to save it here.
              </p>
            </div>
          ) : (
            savedProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  setActiveOpportunity(proj);
                  setSavedDrawerOpen(false);
                }}
                className="p-4 rounded-2xl glass-card glass-card-hover border border-white/10 cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {proj.domain}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400">
                    <Zap className="h-3 w-3 fill-cyan-400" />
                    {proj.projectFitScore}% Fit
                  </span>
                </div>

                <h4 className="font-heading font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  {proj.title}
                </h4>
                <p className="text-slate-400 text-[11px] line-clamp-2">
                  {proj.theProblem?.summary}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                  <span className="text-slate-500 text-[10px]">
                    Saved {new Date(proj.savedAt || Date.now()).toLocaleDateString()}
                  </span>
                  
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleDownloadReadme(proj, e)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title="Download README"
                    >
                      <FileDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => toggleSaveProject(proj)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 text-center text-[11px] text-slate-500">
          Saved in browser storage for instant review & submission defense.
        </div>

      </div>
    </div>
  );
}
