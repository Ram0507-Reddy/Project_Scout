import React, { useState } from 'react';
import { useAppStore } from '../lib/store';
import { generateVivaDefenseSuite } from '../lib/mentorEngine';
import { 
  GraduationCap, ShieldAlert, Sparkles, ChevronDown, 
  ChevronUp, Loader2, Award, HelpCircle 
} from 'lucide-react';

export const VivaDefenseView = () => {
  const { 
    vivaData, 
    setVivaData, 
    vivaStatus, 
    setVivaStatus, 
    repoData, 
    mentorProjectContext, 
    auditResults,
    setRepoModalOpen
  } = useAppStore();

  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  const handleGenerateViva = async () => {
    if (!repoData) return;
    setVivaStatus('generating');
    try {
      const suite = await generateVivaDefenseSuite(mentorProjectContext, repoData, auditResults);
      setVivaData(suite);
      setVivaStatus('completed');
    } catch (err) {
      console.error('Viva generation failed:', err);
      setVivaStatus('error');
    }
  };

  if (!repoData) {
    return (
      <div className="p-10 rounded-3xl bg-white border border-zinc-200 text-center space-y-4 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-14 h-14 rounded-2xl bg-[#FF5A43]/10 border border-[#FF5A43]/20 flex items-center justify-center text-[#FF5A43] mx-auto">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h3 className="text-base font-extrabold text-zinc-900">GitHub Repository Required</h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Connect your public GitHub repository so the AI can inspect your actual code files, dependencies, and README to generate real viva defense questions.
        </p>
        <button
          onClick={() => setRepoModalOpen(true)}
          className="px-6 py-3 rounded-xl btn-black text-xs font-bold cursor-pointer mt-2"
        >
          Connect GitHub Repository
        </button>
      </div>
    );
  }

  if (!vivaData && vivaStatus !== 'generating') {
    return (
      <div className="p-10 rounded-3xl bg-white border border-zinc-200 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-[#FF5A43]/10 border border-[#FF5A43]/20 flex items-center justify-center text-[#FF5A43] mx-auto">
          <GraduationCap className="w-7 h-7" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-mono font-bold text-zinc-800">
          <span>Target Repo:</span>
          <span className="text-orange-600">{repoData.owner}/{repoData.name}</span>
        </div>
        <h3 className="text-lg font-black text-zinc-900">
          Generate Viva Defense Questions from Codebase
        </h3>
        <p className="text-xs text-zinc-500 max-w-lg mx-auto">
          The engine scans all {repoData.fileTree?.length || 0} indexed files, dependencies, and README in your repository to find architectural blindspots, edge cases, and methodology questions an examiner will ask.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setRepoModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Change Repository
          </button>
          <button
            onClick={handleGenerateViva}
            disabled={!repoData}
            className="px-6 py-3 rounded-xl btn-black text-xs font-bold flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#2DD4BF]" />
            <span>Generate Code-Grounded Viva Questions</span>
          </button>
        </div>
      </div>
    );
  }

  if (vivaStatus === 'generating') {
    return (
      <div className="p-12 rounded-3xl bg-white border border-zinc-200 text-center space-y-4 shadow-sm">
        <Loader2 className="w-10 h-10 text-[#FF5A43] animate-spin mx-auto" />
        <h3 className="text-base font-bold text-zinc-900">
          Analyzing Repository Files & Structure...
        </h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto font-mono">
          Scanning {repoData.owner}/{repoData.name} ({repoData.fileTree?.length || 0} files) for technical decisions and examiner questions...
        </p>
      </div>
    );
  }

  const { vivaReadinessScore, topExaminerRisks, questions, defenseCheatSheet } = vivaData || {};

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Viva Readiness Score */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center font-black text-2xl ${
            vivaReadinessScore >= 75 ? 'text-emerald-700 border-emerald-300 bg-emerald-50' :
            vivaReadinessScore >= 55 ? 'text-amber-700 border-amber-300 bg-amber-50' :
            'text-rose-700 border-rose-300 bg-rose-50'
          }`}>
            {vivaReadinessScore || 68}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-zinc-900">Viva Defense Readiness</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-mono font-semibold">
                {repoData.owner}/{repoData.name}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              {vivaReadinessScore >= 75 ? 'Strong technical defense readiness. Review file-specific questions below.' : 'High risk of examiner pushback on architectural decisions and missing documentation.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setRepoModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Change Repo
          </button>
          <button
            onClick={handleGenerateViva}
            className="px-4 py-2 rounded-xl btn-black text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>Re-Analyze Repo</span>
          </button>
        </div>
      </div>

      {/* Top Examiner Blindspots & Risks */}
      {topExaminerRisks && topExaminerRisks.length > 0 && (
        <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 space-y-2">
          <div className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            Top 3 Examiner Traps You Must Anticipate
          </div>
          <ul className="space-y-1.5 text-xs text-rose-900">
            {topExaminerRisks.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Personalized Harsh Viva Questions */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#FF5A43]" />
          Repository-Grounded Viva Questions ({questions?.length || 0})
        </h4>

        {(questions || []).map((q, idx) => {
          const isExpanded = expandedQuestionId === (q.id || idx);
          return (
            <div 
              key={q.id || idx}
              className="rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 transition-all overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setExpandedQuestionId(isExpanded ? null : (q.id || idx))}
                className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-zinc-50/60 transition-colors cursor-pointer"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                      {q.category}
                    </span>
                    {q.codeOrFileAnchor && (
                      <span className="text-[10px] text-zinc-400 font-mono">
                        Target: {q.codeOrFileAnchor}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-bold text-zinc-900">
                    Q{idx + 1}. {q.question}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-zinc-400 shrink-0 mt-1" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-zinc-400 shrink-0 mt-1" />
                )}
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 space-y-3 text-xs border-t border-zinc-100 bg-zinc-50/50">
                  {/* Why Examiner Asks */}
                  <div className="p-3.5 rounded-xl bg-white border border-zinc-200 text-zinc-700">
                    <strong className="text-amber-700">Why the examiner is asking this:</strong> {q.whyExaminerAsks}
                  </div>

                  {/* Danger Answer to Avoid */}
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                    <strong className="text-rose-700">Danger Answer (Will fail defense):</strong> {q.dangerAnswer}
                  </div>

                  {/* Ideal Model Defense Strategy */}
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <strong className="text-emerald-700">Ideal Defense Strategy:</strong> {q.idealDefenseStrategy}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Defense Cheat Sheet */}
      {defenseCheatSheet && (
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 space-y-4 shadow-sm">
          <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-[#2DD4BF]" />
            Examiner Pitch & Defense Cheat Sheet
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
              <div className="text-xs font-bold text-zinc-900">1. Novelty 30-Sec Pitch</div>
              <p className="text-xs text-zinc-600">{defenseCheatSheet.noveltyPitch}</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
              <div className="text-xs font-bold text-zinc-900">2. Limitation Defense</div>
              <p className="text-xs text-zinc-600">{defenseCheatSheet.limitationDefense}</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
              <div className="text-xs font-bold text-zinc-900">3. Tech Choice Justification</div>
              <p className="text-xs text-zinc-600">{defenseCheatSheet.techChoiceJustification}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
