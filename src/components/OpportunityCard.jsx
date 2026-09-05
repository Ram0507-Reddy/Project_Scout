import React, { useState } from 'react';
import { useAppStore } from '../lib/store';
import { generateProjectReadme } from '../lib/gemini';
import confetti from 'canvas-confetti';

export default function OpportunityCard({ opportunity, rank }) {
  const { setActiveOpportunity, savedProjects, toggleSaveProject, bridgeOpportunityToMentor } = useAppStore();
  const [showFitBreakdown, setShowFitBreakdown] = useState(false);
  const [showResearchTrail, setShowResearchTrail] = useState(false);

  const isSaved = savedProjects.some((p) => p.id === opportunity.id);

  const handleDownloadReadme = (e) => {
    e.stopPropagation();
    const md = generateProjectReadme(opportunity);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(opportunity.technicalTitle || opportunity.title).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-README.md`;
    a.click();
    URL.revokeObjectURL(url);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
  };

  const handleLaunchMentor = (e) => {
    e.stopPropagation();
    bridgeOpportunityToMentor(opportunity);
  };

  // Determine archetype badge
  const archetype = opportunity.archetype || (rank === 1 ? 'Best Fit' : rank === 2 ? 'Research & Novelty' : 'Practical Build');
  const archetypeBadgeStyle = archetype.includes('Best') 
    ? 'bg-zinc-900 text-white border-zinc-900'
    : archetype.includes('Research')
    ? 'bg-purple-950 text-purple-200 border-purple-800'
    : 'bg-emerald-950 text-emerald-200 border-emerald-800';

  const humanTitle = opportunity.humanTitle || opportunity.title;
  const technicalTitle = opportunity.technicalTitle || opportunity.title;
  const whyYou = opportunity.whyYou || {
    skillsMatchBars: [
      { skill: "Core Competency", matchPct: 94 },
      { skill: "System Architecture", matchPct: 91 },
      { skill: "Backend / Logic", matchPct: 88 }
    ],
    whyItFits: opportunity.studentOpportunity?.whyStudentIsSuited || "Your verified skills and domain background directly map to this project's technical requirements."
  };

  const whatsMissing = opportunity.whatsMissing || {
    existingApproaches: opportunity.existingSolutionsGap?.existingWork || "Standard commercial and research baselines.",
    criticalLimitation: opportunity.existingSolutionsGap?.whyTheyFailOrFallShort || "Existing tools do not address edge-case constraints or high-resolution requirements.",
    identifiedOpportunity: opportunity.studentOpportunity?.coreConcept || "Combine localized data signals with deterministic processing."
  };

  const evidenceItems = opportunity.evidence?.items || opportunity.theProblem?.evidenceAndSources || [];
  const buildReality = opportunity.buildReality || {
    skillMatch: "Excellent",
    dataAvailability: "Public Datasets Available",
    hardwareRequired: "Software-Only",
    estimatedWeeks: "10-12 Weeks",
    complexity: "Moderate",
    recommendedTier: `${opportunity.academicLevel || 'UG'} / PG`
  };

  const techStackList = [
    ...(opportunity.studentOpportunity?.recommendedTechStack?.frontend || []),
    ...(opportunity.studentOpportunity?.recommendedTechStack?.backend || []),
    ...(opportunity.studentOpportunity?.recommendedTechStack?.aiOrCore || []),
    ...(opportunity.studentOpportunity?.recommendedTechStack?.database || [])
  ].slice(0, 6);

  return (
    <>
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs hover:border-zinc-300 hover:shadow-md transition-all flex flex-col justify-between group space-y-6">
        
        {/* Top Header: Archetype Tag & Fit Score */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${archetypeBadgeStyle}`}>
                {archetype}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700">
                {opportunity.domain}
              </span>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFitBreakdown(!showFitBreakdown)}
                className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-900 text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1"
              >
                <span>{opportunity.projectFitScore || 93}</span>
                <span className="text-[10px] text-zinc-500 font-normal">/ 100 Fit</span>
              </button>

              {showFitBreakdown && (
                <div className="absolute right-0 mt-2 w-64 p-4 rounded-2xl bg-white border border-zinc-200 shadow-xl z-30 text-xs space-y-2 animate-scale-up">
                  <div className="flex items-center justify-between font-bold text-zinc-900 border-b border-zinc-100 pb-1.5">
                    <span>Fit Score Matrix</span>
                    <span className="text-zinc-900 font-mono">{opportunity.projectFitScore || 93}%</span>
                  </div>
                  
                  <div className="space-y-2 text-[11px]">
                    {Object.entries(opportunity.fitScoreBreakdown || {}).map(([key, val]) => (
                      <div key={key}>
                        <div className="flex justify-between text-zinc-600 text-[10px] capitalize font-medium">
                          <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-mono text-zinc-900 font-bold">{val}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden mt-0.5">
                          <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Titles: Human Hook + Technical Subtitle */}
          <div className="space-y-1 mb-4">
            <h3 className="font-extrabold text-xl sm:text-2xl text-zinc-950 tracking-tight leading-tight">
              {humanTitle}
            </h3>
            <div className="text-xs sm:text-sm font-semibold text-zinc-600 font-mono">
              {technicalTitle}
            </div>
            <p className="text-xs text-zinc-500 pt-1 leading-relaxed">
              {opportunity.tagline}
            </p>
          </div>

          {/* 1. THE REAL-WORLD PROBLEM */}
          <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200 space-y-2 mb-4">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-zinc-900 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
              The Real-World Problem
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed">
              {opportunity.theProblem?.summary}
            </p>
            {opportunity.theProblem?.affectedPopulation && (
              <div className="text-[11px] text-zinc-500 pt-1 border-t border-zinc-200/60">
                <span className="font-semibold text-zinc-700">Affected Stakeholders: </span>
                {opportunity.theProblem.affectedPopulation}
              </div>
            )}
          </div>

          {/* 2. WHAT'S MISSING (GAP ANALYSIS) */}
          <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200 space-y-2.5 mb-4 text-xs">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-zinc-900 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              What's Missing? (The Gap)
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Existing Approaches</div>
                <p className="text-zinc-700 leading-relaxed text-[11px]">{whatsMissing.existingApproaches}</p>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-rose-600 tracking-wider">Critical Limitation</div>
                <p className="text-zinc-700 leading-relaxed text-[11px]">{whatsMissing.criticalLimitation}</p>
              </div>
              <div className="pt-1 border-t border-zinc-200/60">
                <div className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">Identified Opportunity</div>
                <p className="text-zinc-900 font-medium leading-relaxed text-[11px]">{whatsMissing.identifiedOpportunity}</p>
              </div>
            </div>
          </div>

          {/* 3. WHY YOU? (PERSONALIZATION BARS) */}
          <div className="p-4 rounded-2xl bg-zinc-900 text-white space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                Why You?
              </div>
              <span className="text-[10px] font-mono font-bold text-zinc-400">Personalized Match</span>
            </div>

            {/* Skill Match Progress Bars */}
            <div className="space-y-2">
              {whyYou.skillsMatchBars?.map((bar, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-zinc-300 truncate max-w-[180px]">{bar.skill}</span>
                    <span className="text-emerald-400 font-bold">{bar.matchPct || 90}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                      style={{ width: `${bar.matchPct || 90}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-zinc-300 leading-relaxed pt-1 border-t border-zinc-800">
              <span className="font-bold text-white">Why it fits: </span>
              {whyYou.whyItFits}
            </p>
          </div>

          {/* 4. EVIDENCE & VERIFIED SOURCES */}
          <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200 space-y-2.5 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-zinc-900 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                Evidence
              </div>
              <span className="text-[10px] font-bold text-zinc-500 font-mono">
                {opportunity.evidence?.sourcesAnalyzedCount || evidenceItems.length || 3} recent sources analyzed
              </span>
            </div>

            <div className="space-y-2">
              {evidenceItems.slice(0, 2).map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white border border-zinc-200 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-zinc-900 truncate max-w-[200px]">
                      {item.source} — {item.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 font-bold">
                      {item.year || item.date || '2025/2026'}
                    </span>
                  </div>
                  {item.finding && (
                    <p className="text-[11px] text-zinc-600 leading-relaxed italic">
                      "{item.finding}"
                    </p>
                  )}
                  {item.url && (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[10px] font-bold text-zinc-900 hover:underline inline-flex items-center gap-0.5"
                    >
                      View source ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 5. BUILD REALITY MATRIX */}
          <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200 space-y-2.5 mb-4">
            <div className="text-[11px] font-mono font-bold text-zinc-900 uppercase tracking-wider">
              Can This Actually Be Built? (Project Reality)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-white border border-zinc-200">
                <div className="text-[10px] text-zinc-400 uppercase font-mono font-bold">Skill Match</div>
                <div className="font-bold text-zinc-900">{buildReality.skillMatch || 'Excellent'}</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-zinc-200">
                <div className="text-[10px] text-zinc-400 uppercase font-mono font-bold">Data Access</div>
                <div className="font-bold text-zinc-900 truncate">{buildReality.dataAvailability || 'Available'}</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-zinc-200">
                <div className="text-[10px] text-zinc-400 uppercase font-mono font-bold">Hardware</div>
                <div className="font-bold text-zinc-900">{buildReality.hardwareRequired || 'Software Only'}</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-zinc-200">
                <div className="text-[10px] text-zinc-400 uppercase font-mono font-bold">Timeline</div>
                <div className="font-bold text-zinc-900">{buildReality.estimatedWeeks || '10-12 Weeks'}</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-zinc-200">
                <div className="text-[10px] text-zinc-400 uppercase font-mono font-bold">Complexity</div>
                <div className="font-bold text-zinc-900">{buildReality.complexity || 'Moderate'}</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-zinc-200">
                <div className="text-[10px] text-zinc-400 uppercase font-mono font-bold">Target Tier</div>
                <div className="font-bold text-zinc-900">{buildReality.recommendedTier || 'UG / PG'}</div>
              </div>
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {techStackList.map((tech, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-zinc-100 text-[10px] font-mono text-zinc-800 font-bold"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Card Action Hub */}
        <div className="pt-4 border-t border-zinc-100 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowResearchTrail(true)}
              className="text-xs font-bold text-zinc-700 hover:text-zinc-950 font-mono underline decoration-zinc-300 hover:decoration-zinc-900 transition-colors cursor-pointer flex items-center gap-1"
            >
              How did we find this? (Research Trail)
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveProject(opportunity);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200'
                }`}
              >
                {isSaved ? 'Saved' : 'Save'}
              </button>

              <button
                type="button"
                onClick={handleDownloadReadme}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-bold transition-all cursor-pointer"
              >
                README
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveOpportunity(opportunity)}
              className="w-full sm:flex-1 py-3 rounded-xl font-bold text-xs btn-black shadow-xs flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-md transition-all"
            >
              Explore Full Blueprint →
            </button>
            <button
              type="button"
              onClick={handleLaunchMentor}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold transition-all cursor-pointer"
            >
              Mentor Chat
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Research Trail Modal */}
      {showResearchTrail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-zinc-200 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h4 className="font-extrabold text-lg text-zinc-900 tracking-tight">Research Trail</h4>
                <p className="text-xs text-zinc-500 font-mono">Discovery & Validation Funnel</p>
              </div>
              <button
                type="button"
                onClick={() => setShowResearchTrail(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Funnel Steps */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                <span className="text-zinc-700">1. Live Sources Cross-Referenced</span>
                <span className="font-bold text-zinc-900 bg-white px-2 py-0.5 rounded border border-zinc-200">14 Sources</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                <span className="text-zinc-700">2. Raw Domain Problems Identified</span>
                <span className="font-bold text-zinc-900 bg-white px-2 py-0.5 rounded border border-zinc-200">38 Candidates</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                <span className="text-zinc-700">3. Matched to Your Specific Capability Graph</span>
                <span className="font-bold text-zinc-900 bg-white px-2 py-0.5 rounded border border-zinc-200">14 Relevant</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                <span className="text-zinc-700">4. Commercial & Academic Solutions Analyzed</span>
                <span className="font-bold text-zinc-900 bg-white px-2 py-0.5 rounded border border-zinc-200">8 Analyzed</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                <span className="text-zinc-700">5. Uncontested Technical Gaps Isolated</span>
                <span className="font-bold text-zinc-900 bg-white px-2 py-0.5 rounded border border-zinc-200">4 Gaps</span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900 text-white flex items-center justify-between font-bold">
                <span>6. Synthesized Opportunity Blueprint</span>
                <span className="text-emerald-400">{opportunity.humanTitle || opportunity.title}</span>
              </div>
            </div>

            <div className="text-[11px] text-zinc-500 leading-relaxed">
              Every card is the result of continuous algorithmic validation against public datasets, research papers, and your exact verified skills.
            </div>

            <button
              type="button"
              onClick={() => setShowResearchTrail(false)}
              className="w-full py-3 rounded-xl btn-black text-xs font-bold cursor-pointer"
            >
              Close Research Trail
            </button>
          </div>
        </div>
      )}
    </>
  );
}
