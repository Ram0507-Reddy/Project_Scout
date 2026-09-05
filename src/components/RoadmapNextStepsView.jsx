import React from 'react';
import { useAppStore } from '../lib/store';
import { 
  Rocket, Clock, Check 
} from 'lucide-react';

export const RoadmapNextStepsView = () => {
  const { auditResults } = useAppStore();

  const steps = auditResults?.prioritizedNextSteps || [
    {
      step: 1,
      task: "Implement JWT Authentication & API Route Protection",
      priority: "HIGH",
      rationale: "Frontend currently consumes unauthenticated endpoints, creating security audit failure in academic review.",
      targetFiles: ["backend/main.py", "backend/routes/auth.py", "src/App.jsx"]
    },
    {
      step: 2,
      task: "Add Quantifiable Evaluation Metric vs MobileNetV3 Baseline",
      priority: "HIGH",
      rationale: "Examiners will reject ML claims without confusion matrix, F1-score, and latency benchmarks.",
      targetFiles: ["backend/models/evaluate.py", "docs/benchmarks.md"]
    },
    {
      step: 3,
      task: "Document Database Schema and Migration Instructions",
      priority: "MEDIUM",
      rationale: "Project setup is non-reproducible for external evaluator without schema definitions.",
      targetFiles: ["README.md", "database/schema.sql"]
    },
    {
      step: 4,
      task: "Write Unit Tests for Inference & Preprocessing Pipeline",
      priority: "MEDIUM",
      rationale: "Test coverage is under 20%, representing significant technical debt.",
      targetFiles: ["tests/test_preprocess.py", "tests/test_predict.py"]
    }
  ];

  const milestones = [
    { date: "Phase 1", title: "Problem Definition & Gap Analysis", status: "completed" },
    { date: "Phase 2", title: "System Architecture & Schema Design", status: "completed" },
    { date: "Current", title: "Core Prototype & ML Inference API", status: "in-progress" },
    { date: "Upcoming", title: "Quantifiable Benchmarking & Evaluation", status: "pending" },
    { date: "Upcoming", title: "Documentation & Viva Presentation Prep", status: "pending" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: What Should I Do Next? */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-2 text-[#FF5A43] font-bold text-xs uppercase tracking-wider mb-1">
          <Rocket className="w-4 h-4" />
          Recommended Next Action
        </div>
        <h3 className="text-base font-extrabold text-zinc-900 mb-1">
          {steps[0]?.task}
        </h3>
        <p className="text-xs text-zinc-600 leading-relaxed max-w-2xl">
          <strong className="text-zinc-800">Why do this first?</strong> {steps[0]?.rationale}
        </p>
      </div>

      {/* Prioritized Steps Card List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
          Prioritized Engineering & Academic Backlog ({steps.length})
        </h4>

        {steps.map((item, idx) => (
          <div 
            key={idx}
            className="p-5 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white font-mono text-[11px] flex items-center justify-center font-bold">
                  {item.step || idx + 1}
                </span>
                <span className="text-sm font-bold text-zinc-900">
                  {item.task}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono ${
                  item.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' :
                  item.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                  'bg-teal-100 text-teal-800'
                }`}>
                  {item.priority} PRIORITY
                </span>
              </div>
              <p className="text-xs text-zinc-600 pl-8 leading-relaxed">
                {item.rationale}
              </p>
              {item.targetFiles && item.targetFiles.length > 0 && (
                <div className="pl-8 flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-zinc-400">Touch files:</span>
                  {item.targetFiles.map((file, fIdx) => (
                    <span key={fIdx} className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-mono font-medium">
                      {file}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Project Timeline & Milestones */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 space-y-4 shadow-sm">
        <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#2DD4BF]" />
          Academic Capstone Timeline & Progress
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {milestones.map((m, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-2xl border relative ${
                m.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                m.status === 'in-progress' ? 'bg-zinc-900 border-zinc-900 text-white shadow-md' :
                'bg-zinc-50 border-zinc-200 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
                  {m.date}
                </span>
                {m.status === 'completed' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                {m.status === 'in-progress' && <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-ping" />}
              </div>
              <div className={`text-xs font-bold line-clamp-2 ${m.status === 'in-progress' ? 'text-white' : 'text-zinc-900'}`}>
                {m.title}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
