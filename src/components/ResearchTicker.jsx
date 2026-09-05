import React from 'react';
import { Brain, Filter, BarChart3, Sparkles, CheckCircle2, Clock, Globe } from 'lucide-react';
import { useAppStore } from '../lib/store';

export default function ResearchTicker() {
  const { discoveryStatus, researchLogs } = useAppStore();

  if (discoveryStatus === 'idle') return null;

  const getStepIcon = (type) => {
    switch (type) {
      case 'analyzing':
        return <Brain className="h-4 w-4 text-[#FF5A43] animate-pulse" />;
      case 'researching':
        return <Globe className="h-4 w-4 text-[#2DD4BF] animate-spin-slow" />;
      case 'filtering':
        return <Filter className="h-4 w-4 text-amber-500 animate-bounce" />;
      case 'scoring':
        return <BarChart3 className="h-4 w-4 text-purple-600" />;
      case 'synthesizing':
        return <Sparkles className="h-4 w-4 text-emerald-600 animate-spin-slow" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-[#2DD4BF]" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5A43] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF5A43]"></span>
          </div>
          <span className="font-extrabold text-sm text-zinc-900">
            Multi-Stage Problem Discovery Engine in Progress
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-700 bg-zinc-100 px-2.5 py-0.5 rounded-full font-bold">
          Gemini Intelligence Pipeline
        </span>
      </div>

      {/* Logs stream */}
      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
        {researchLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs"
          >
            <div className="p-1.5 rounded-xl bg-white border border-zinc-200 shrink-0 mt-0.5 shadow-xs">
              {getStepIcon(log.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900">{log.step}</span>
                <span className="text-[10px] font-mono text-zinc-400">{log.time}</span>
              </div>
              <p className="text-zinc-600 text-[11px] mt-0.5 leading-relaxed">
                {log.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Footer */}
      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-[#2DD4BF] animate-spin-slow" />
          Cross-referencing live datasets, research papers & prior art...
        </span>
        <span className="font-mono text-zinc-900 font-bold">
          {discoveryStatus === 'completed' ? '100% DISCOVERY COMPLETE' : 'PROCESSING...'}
        </span>
      </div>
    </div>
  );
}
