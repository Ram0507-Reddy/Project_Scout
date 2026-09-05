import React from 'react';
import { X, Bookmark, FileDown, Trash2, Zap } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-white border-l border-zinc-200 shadow-2xl flex flex-col justify-between animate-slide-left">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <Bookmark className="h-5 w-5 text-[#FF5A43]" />
            <h3 className="font-extrabold text-base text-zinc-900">
              Saved Project Opportunities ({savedProjects.length})
            </h3>
          </div>
          <button
            onClick={() => setSavedDrawerOpen(false)}
            className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5 text-xs bg-zinc-50/50">
          {savedProjects.length === 0 ? (
            <div className="text-center py-16 text-zinc-400 space-y-3">
              <Bookmark className="h-10 w-10 mx-auto opacity-30 text-[#FF5A43]" />
              <p className="font-medium text-zinc-600">No opportunities saved yet.</p>
              <p className="text-[11px] text-zinc-400">
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
                className="p-4 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 shadow-sm cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                    {proj.domain}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-900 font-bold">
                    <Zap className="h-3 w-3 fill-zinc-900" />
                    {proj.projectFitScore}% Fit
                  </span>
                </div>

                <h4 className="font-bold text-sm text-zinc-900 group-hover:text-[#FF5A43] transition-colors">
                  {proj.title}
                </h4>
                <p className="text-zinc-500 text-[11px] line-clamp-2 font-normal">
                  {proj.theProblem?.summary}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[11px]">
                  <span className="text-zinc-400 text-[10px]">
                    Saved {new Date(proj.savedAt || Date.now()).toLocaleDateString()}
                  </span>
                  
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleDownloadReadme(proj, e)}
                      className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900"
                      title="Download README"
                    >
                      <FileDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => toggleSaveProject(proj)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
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
        <div className="p-4 border-t border-zinc-200 bg-white text-center text-[11px] text-zinc-500">
          Saved in browser storage for instant review & submission defense.
        </div>

      </div>
    </div>
  );
}
