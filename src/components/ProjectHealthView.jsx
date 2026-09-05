import React from 'react';
import { useAppStore } from '../lib/store';
import { 
  Activity, ShieldAlert, CheckCircle2, AlertTriangle, 
  Layers, Cpu, BookOpen 
} from 'lucide-react';

export const ProjectHealthView = () => {
  const { auditResults, setRepoModalOpen } = useAppStore();

  if (!auditResults) {
    return (
      <div className="p-10 rounded-3xl bg-white border border-zinc-200 text-center space-y-4 shadow-sm">
        <Activity className="w-12 h-12 text-zinc-300 mx-auto animate-pulse" />
        <h3 className="text-base font-extrabold text-zinc-900">No Audit Telemetry Available</h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Connect a GitHub repository to trigger the 10-point technical & academic health check.
        </p>
        <button
          onClick={() => setRepoModalOpen(true)}
          className="px-5 py-2.5 rounded-xl btn-black text-xs font-bold cursor-pointer"
        >
          Connect Repository
        </button>
      </div>
    );
  }

  const { overallScore, technicalScore, academicScore, categoryScores, findings, academicEvaluation, estimatedImplementationStages, mentorChallenge } = auditResults;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-700 border-emerald-300 bg-emerald-50';
    if (score >= 60) return 'text-amber-700 border-amber-300 bg-amber-50';
    return 'text-rose-700 border-rose-300 bg-rose-50';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Mentor Challenge */}
      {mentorChallenge && (
        <div className="p-5 rounded-3xl bg-[#FF5A43]/5 border border-[#FF5A43]/20 flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-[#FF5A43]/10 border border-[#FF5A43]/20 flex items-center justify-center text-[#FF5A43] shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#FF5A43] uppercase tracking-wider">
                Mentor Challenge & Rigor Alert
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                auditResults?.isFallback 
                  ? 'bg-zinc-100 text-zinc-600 border border-zinc-200' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {auditResults?.isFallback ? 'Deterministic Code Analysis' : 'Live Gemini 3.7 Intelligence'}
              </span>
            </div>
            <p className="text-sm font-bold text-zinc-900">
              {mentorChallenge.issue}
            </p>
            <p className="text-xs text-zinc-600">
              <strong className="text-zinc-800">Why it matters:</strong> {mentorChallenge.whyItMatters}
            </p>
            {mentorChallenge.actionPrompt && (
              <p className="text-xs text-[#FF5A43] font-semibold pt-0.5">
                Action Required: {mentorChallenge.actionPrompt}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 3 Main Health Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Score */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Project Health
            </div>
            <div className="text-3xl font-black text-zinc-900">
              {overallScore}<span className="text-base text-zinc-400 font-normal">/100</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-medium">
              {overallScore >= 75 ? 'Capstone Ready' : 'Needs Solidification'}
            </div>
          </div>
          <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center font-black text-xl ${getScoreColor(overallScore)}`}>
            {overallScore}%
          </div>
        </div>

        {/* Technical Score */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Technical Review
            </div>
            <div className="text-3xl font-black text-zinc-900">
              {technicalScore}<span className="text-base text-zinc-400 font-normal">/100</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-medium">
              Codebase, Architecture & Security
            </div>
          </div>
          <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center font-black text-xl ${getScoreColor(technicalScore)}`}>
            {technicalScore}%
          </div>
        </div>

        {/* Academic Score */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Academic Review
            </div>
            <div className="text-3xl font-black text-zinc-900">
              {academicScore}<span className="text-base text-zinc-400 font-normal">/100</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-medium">
              Novelty, Gap & Methodology
            </div>
          </div>
          <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center font-black text-xl ${getScoreColor(academicScore)}`}>
            {academicScore}%
          </div>
        </div>
      </div>

      {/* Sub-Category Radar Breakdown */}
      {categoryScores && (
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm">
          <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#FF5A43]" />
            Core Dimension Breakdown
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {Object.entries(categoryScores).map(([key, score]) => (
              <div key={key} className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                <div className="text-[11px] text-zinc-500 capitalize mb-1 font-medium">
                  {key.replace(/([A-Z])/g, ' $1')}
                </div>
                <div className={`text-lg font-black ${getScoreColor(score).split(' ')[0]}`}>
                  {score}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Implementation Status Layer Estimates */}
      {estimatedImplementationStages && (
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm">
          <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#2DD4BF]" />
              AI Implementation Status Estimates
            </span>
            <span className="text-[10px] text-zinc-400 font-normal">Calculated from repository tree</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {Object.entries(estimatedImplementationStages).map(([layer, pct]) => (
              <div key={layer} className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                <div className="flex items-center justify-between text-xs text-zinc-700 mb-1.5 capitalize font-semibold">
                  <span>{layer.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-mono font-bold text-zinc-900">{pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-200 overflow-hidden">
                  <div 
                    className="h-full bg-zinc-900 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Academic Evaluation Matrix */}
      {academicEvaluation && (
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm">
          <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-500" />
            Academic Capstone Evaluation Matrix
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(academicEvaluation).map(([crit, info]) => (
              <div key={crit} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 capitalize">
                    {crit.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    info.status === 'Strong' ? 'bg-emerald-100 text-emerald-800' :
                    info.status === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {info.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {info.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Critical Findings */}
        <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 space-y-3">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            Critical Gaps ({findings?.critical?.length || 0})
          </div>
          <div className="space-y-2.5">
            {(findings?.critical || []).map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-white border border-rose-200 text-xs space-y-1 shadow-sm">
                <div className="font-bold text-rose-900">{item.title}</div>
                <p className="text-zinc-600 text-[11px]">{item.description}</p>
                {item.fix && (
                  <div className="text-[11px] text-zinc-900 pt-1 border-t border-zinc-100 font-medium">
                    Fix: {item.fix}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            Needs Attention ({findings?.needsAttention?.length || 0})
          </div>
          <div className="space-y-2.5">
            {(findings?.needsAttention || []).map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-white border border-amber-200 text-xs space-y-1 shadow-sm">
                <div className="font-bold text-amber-900">{item.title}</div>
                <p className="text-zinc-600 text-[11px]">{item.description}</p>
                {item.fix && (
                  <div className="text-[11px] text-zinc-900 pt-1 border-t border-zinc-100 font-medium">
                    Fix: {item.fix}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Good Practices */}
        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Strong Areas ({findings?.good?.length || 0})
          </div>
          <div className="space-y-2.5">
            {(findings?.good || []).map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-white border border-emerald-200 text-xs space-y-1 shadow-sm">
                <div className="font-bold text-emerald-900">{item.title}</div>
                <p className="text-zinc-600 text-[11px]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
