import React from 'react';
import { Search, Brain, Filter, BarChart3, Sparkles, CheckCircle2, Clock, Globe, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../lib/store';

export default function ResearchTicker() {
  const { discoveryStatus, researchLogs } = useAppStore();

  if (discoveryStatus === 'idle') return null;

  const getStepIcon = (type) => {
    switch (type) {
      case 'analyzing':
        return <Brain className="h-4 w-4 text-cyan-400 animate-pulse" />;
      case 'researching':
        return <Globe className="h-4 w-4 text-blue-400 animate-spin-slow" />;
      case 'filtering':
        return <Filter className="h-4 w-4 text-amber-400 animate-bounce" />;
      case 'scoring':
        return <BarChart3 className="h-4 w-4 text-purple-400" />;
      case 'synthesizing':
        return <Sparkles className="h-4 w-4 text-emerald-400 animate-spin-slow" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-cyan-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-5 rounded-2xl glass-panel border border-cyan-500/20 shadow-2xl glow-cyan animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </div>
          <span className="font-heading font-semibold text-sm text-white">
            Multi-Stage Problem Discovery Engine in Progress
          </span>
        </div>
        <span className="text-[11px] font-mono text-cyan-300/80 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
          Live Gemini 2.5 Intelligence Pipeline
        </span>
      </div>

      {/* Logs stream */}
      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
        {researchLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/50 border border-white/5 text-xs animate-slide-up"
          >
            <div className="p-1.5 rounded-lg bg-slate-800 border border-white/10 shrink-0 mt-0.5">
              {getStepIcon(log.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">{log.step}</span>
                <span className="text-[10px] font-mono text-slate-500">{log.time}</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                {log.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Footer */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-cyan-400 animate-spin-slow" />
          Cross-referencing live datasets, research papers & prior art...
        </span>
        <span className="font-mono text-cyan-400 font-semibold">
          {discoveryStatus === 'completed' ? '100% DISCOVERY COMPLETE' : 'PROCESSING...'}
        </span>
      </div>
    </div>
  );
}
