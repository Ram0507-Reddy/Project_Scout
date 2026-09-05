import React from 'react';
import { useAppStore } from '../lib/store';

export default function WhyUsView() {
  const { setActiveTab } = useAppStore();

  const comparisonRows = [
    {
      feature: 'Problem Ideation Source',
      existing: 'Recycled blog lists, generic clones (Todo app, Netflix clone, basic sentiment analysis)',
      projectScout: 'Real-world verified domain problems with empirical research gaps and real datasets'
    },
    {
      feature: 'Academic Depth Calibration',
      existing: 'One-size-fits-all generic project ideas with no academic framing',
      projectScout: 'Strict tier calibration for UG (working utility), PG (benchmarking), and PhD (novelty)'
    },
    {
      feature: 'Repository & Code Awareness',
      existing: 'Static suggestions disconnected from what you actually write',
      projectScout: 'Deep GitHub repository tree inspection, code diagnostics, and architectural health grading'
    },
    {
      feature: 'Viva Defense Preparation',
      existing: 'None, or generic interview Q&A flashcards',
      projectScout: 'Adversarial AI external examiner grill sessions tailored to your exact repository code'
    },
    {
      feature: 'Capstone Documentation Rubrics',
      existing: 'Manual formatting or vague templates',
      projectScout: '10-Point IEEE/ACM rubric auditor with 1-click research-grade section generator'
    },
    {
      feature: 'Cost & Availability',
      existing: 'Expensive human mentors ($50-$200/hr) or disconnected general AI chat',
      projectScout: 'Instant, continuous, context-aware engineering intelligence available 24/7'
    }
  ];

  return (
    <div className="space-y-16 animate-fade-in pb-12">
      {/* Header Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-wider">
          Platform Architecture & Mission
        </div>
        <h1 className="font-black text-4xl sm:text-5xl lg:text-6xl text-zinc-900 tracking-tight leading-tight">
          Why <span className="text-orange-500">Project Scout</span> exists
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
          Bridging the critical chasm between superficial student projects and rigorous, defensible, industry-grade software engineering.
        </p>
      </section>

      {/* 1. The Problem Statement */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Phase 01</span>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight mt-1">
            The Problem Statement
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-zinc-200 shadow-xs space-y-3">
            <div className="text-xs font-mono font-bold text-zinc-400">01.01</div>
            <h3 className="font-bold text-base text-zinc-900">The Generic Clone Epidemic</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Millions of computer science and engineering students graduate having only built textbook clones—basic e-commerce apps, naive sentiment classifiers, and standard CRUD portals. These lack domain-specific novelty and fail to impress hiring panels or academic examiners.
            </p>
          </div>

          <div className="p-6 bg-white border border-zinc-200 shadow-xs space-y-3">
            <div className="text-xs font-mono font-bold text-zinc-400">01.02</div>
            <h3 className="font-bold text-base text-zinc-900">The Viva & Defense Blindspot</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Students build blindly without preparing for adversarial scrutiny. When external examiners ask about architectural bottlenecks, baseline comparisons, dataset contamination, or failure modes, students struggle because their project lacked deliberate problem framing.
            </p>
          </div>

          <div className="p-6 bg-white border border-zinc-200 shadow-xs space-y-3">
            <div className="text-xs font-mono font-bold text-zinc-400">01.03</div>
            <h3 className="font-bold text-base text-zinc-900">Fragmented & Superficial Guidance</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Ideation happens on static blog posts, coding happens in silos without rubric checks, and viva preparation is crammed into the final 24 hours. There is no unified system connecting real problem discovery directly to repository implementation and defense.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Existing Solutions & Their Limitations */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Phase 02</span>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight mt-1">
            Existing Solutions & Their Limitations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-zinc-200 shadow-xs space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Solution Type A</span>
              <h3 className="font-bold text-base text-zinc-900">Project Idea Aggregators & Blog Lists</h3>
            </div>
            <div className="space-y-2 text-xs text-zinc-600">
              <p className="font-medium text-zinc-800">What they provide:</p>
              <p>Curated static lists of popular titles ("Top 50 Final Year Project Ideas") with basic descriptions.</p>
              <p className="font-medium text-red-600 pt-2">Why they fall short:</p>
              <p>Oversaturated and outdated. They provide zero academic calibration, no datasets, no codebase integration, and no defense preparation.</p>
            </div>
          </div>

          <div className="p-6 bg-white border border-zinc-200 shadow-xs space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Solution Type B</span>
              <h3 className="font-bold text-base text-zinc-900">Generic AI Chatbots</h3>
            </div>
            <div className="space-y-2 text-xs text-zinc-600">
              <p className="font-medium text-zinc-800">What they provide:</p>
              <p>Ad-hoc conversational prompt responses for boilerplate code snippets and high-level ideas.</p>
              <p className="font-medium text-red-600 pt-2">Why they fall short:</p>
              <p>Disconnected from your active GitHub repository structure. They lack capstone academic rubrics and cannot deterministically audit your repo tree or simulate realistic viva stress tests.</p>
            </div>
          </div>

          <div className="p-6 bg-white border border-zinc-200 shadow-xs space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Solution Type C</span>
              <h3 className="font-bold text-base text-zinc-900">Human Mentorship Networks</h3>
            </div>
            <div className="space-y-2 text-xs text-zinc-600">
              <p className="font-medium text-zinc-800">What they provide:</p>
              <p>1-on-1 scheduled sessions with industry professionals or senior developers.</p>
              <p className="font-medium text-red-600 pt-2">Why they fall short:</p>
              <p>Prohibitively expensive ($50–$200/hr) for students, with high latency, asynchronous scheduling bottlenecks, and subjective feedback rather than continuous repository telemetry.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Differentiator */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Phase 03</span>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight mt-1">
            What Differentiates Project Scout
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white border border-zinc-200 shadow-xs space-y-3">
            <div className="w-8 h-8 bg-orange-500 text-white font-bold flex items-center justify-center text-xs">
              01
            </div>
            <h3 className="font-bold text-base text-zinc-900">Real-World Problem Grounding</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              We do not generate generic project prompts. Every opportunity is grounded in real operational failure points, academic tiers (UG prototype vs PG empirical evaluation vs PhD novelty), and specific reference architectures.
            </p>
          </div>

          <div className="p-6 bg-white border border-zinc-200 shadow-xs space-y-3">
            <div className="w-8 h-8 bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
              02
            </div>
            <h3 className="font-bold text-base text-zinc-900">Direct GitHub Repository Telemetry</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Project Scout inspects your actual code tree, imports, configurations, and documentation. It identifies missing production-grade elements like validation schemas, test coverage, and deployment configurations.
            </p>
          </div>

          <div className="p-6 bg-white border border-zinc-200 shadow-xs space-y-3">
            <div className="w-8 h-8 bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
              03
            </div>
            <h3 className="font-bold text-base text-zinc-900">Adversarial Viva Defense Simulator</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Train with an AI external examiner configured to probe edge cases, architectural trade-offs, dataset limitations, and methodology justifications so you enter your actual defense fully prepared.
            </p>
          </div>

          <div className="p-6 bg-white border border-zinc-200 shadow-xs space-y-3">
            <div className="w-8 h-8 bg-orange-500 text-white font-bold flex items-center justify-center text-xs">
              04
            </div>
            <h3 className="font-bold text-base text-zinc-900">IEEE/ACM Capstone Document Auditor</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Audit your README and report against standardized 10-point academic rubrics, with one-click automated generation for missing technical sections, system architecture diagrams, and testing methodologies.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Comparative Matrix */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Phase 04</span>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight mt-1">
            Feature Comparison Matrix
          </h2>
        </div>

        <div className="overflow-x-auto border border-zinc-200 bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th className="p-4 w-1/4">Capability</th>
                <th className="p-4 w-3/8 text-zinc-600">Existing Platforms</th>
                <th className="p-4 w-3/8 text-orange-600 bg-orange-50/50">Project Scout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-xs">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="p-4 font-bold text-zinc-900 align-top">
                    {row.feature}
                  </td>
                  <td className="p-4 text-zinc-600 align-top leading-relaxed">
                    {row.existing}
                  </td>
                  <td className="p-4 text-zinc-900 bg-orange-50/20 font-medium align-top leading-relaxed">
                    {row.projectScout}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Call to Action */}
      <section className="p-8 bg-zinc-900 text-white text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Ready to discover a defensible project?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Start your discovery scan to match real problem statements to your academic tier, or connect an existing repository for continuous health and viva defense preparation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => {
              setActiveTab('discovery');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-all w-full sm:w-auto cursor-pointer"
          >
            Start Problem Discovery
          </button>
          <button
            onClick={() => {
              setActiveTab('health');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all w-full sm:w-auto cursor-pointer"
          >
            Audit Existing Repo
          </button>
        </div>
      </section>
    </div>
  );
}
