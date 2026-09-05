import React, { useState } from 'react';
import { 
  X, 
  Target, 
  AlertTriangle, 
  Cpu, 
  Calendar, 
  Briefcase, 
  FileDown, 
  Bookmark, 
  BookmarkCheck, 
  Zap, 
  ExternalLink,
  Bot,
  Layers,
  Database,
  CheckCircle2,
  HardDrive,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { generateProjectReadme } from '../lib/gemini';
import confetti from 'canvas-confetti';

export default function OpportunityDetailModal() {
  const { activeOpportunity, setActiveOpportunity, savedProjects, toggleSaveProject, bridgeOpportunityToMentor } = useAppStore();
  const [activeTab, setActiveTab] = useState('why-you'); // 'why-you' | 'problem' | 'solution' | 'roadmap' | 'defense'

  if (!activeOpportunity) return null;

  const isSaved = savedProjects.some((p) => p.id === activeOpportunity.id);

  const handleDownloadReadme = () => {
    const md = generateProjectReadme(activeOpportunity);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(activeOpportunity.technicalTitle || activeOpportunity.title).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-README.md`;
    a.click();
    URL.revokeObjectURL(url);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
  };

  const handleLaunchMentorMode = () => {
    bridgeOpportunityToMentor(activeOpportunity);
    setActiveOpportunity(null);
  };

  const whyYou = activeOpportunity.whyYou || {
    headline: "Tailored directly to your technical competencies and engineering domain.",
    skillMatches: [],
    learningCurve: "Standard ramp-up required on domain-specific protocols."
  };

  const evidence = activeOpportunity.evidence || [];
  const whatsMissing = activeOpportunity.whatsMissing || {};
  const buildReality = activeOpportunity.buildReality || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white border border-zinc-200 shadow-2xl overflow-hidden relative my-auto">
        
        {/* Modal Top Header */}
        <div className="p-6 sm:p-7 border-b border-zinc-200 flex items-start justify-between gap-4 bg-[#FAF8F5]">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-zinc-200 text-zinc-800">
                {activeOpportunity.domain}
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white border border-zinc-200 text-zinc-600">
                {activeOpportunity.academicLevel} Standard
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-zinc-900 bg-[#2DD4BF]/30 px-2.5 py-0.5 rounded-full">
                <Zap className="h-3 w-3 fill-zinc-900" />
                {activeOpportunity.projectFitScore}/100 Match Score
              </span>
              {activeOpportunity.archetype && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                  {activeOpportunity.archetype}
                </span>
              )}
            </div>

            {/* Human Hook & Technical Title */}
            <h2 className="font-extrabold text-xl sm:text-2xl text-zinc-900 tracking-tight">
              {activeOpportunity.humanTitle || activeOpportunity.title}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-orange-600 mt-1">
              {activeOpportunity.technicalTitle || activeOpportunity.tagline}
            </p>
          </div>

          <button
            onClick={() => setActiveOpportunity(null)}
            className="p-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 border border-zinc-200 transition-all shrink-0 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-zinc-200 bg-white overflow-x-auto text-xs font-bold">
          {[
            { id: 'why-you', label: '1. Why You?', icon: <Sparkles className="h-3.5 w-3.5" /> },
            { id: 'problem', label: '2. Problem & Evidence', icon: <Target className="h-3.5 w-3.5" /> },
            { id: 'solution', label: '3. Solution & Architecture', icon: <Cpu className="h-3.5 w-3.5" /> },
            { id: 'feasibility', label: '4. Build Reality Matrix', icon: <HardDrive className="h-3.5 w-3.5" /> },
            { id: 'roadmap', label: '5. Roadmap & Milestones', icon: <Calendar className="h-3.5 w-3.5" /> },
            { id: 'defense', label: '6. Resume & Defense Pack', icon: <Briefcase className="h-3.5 w-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-zinc-900 text-zinc-900 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm bg-white">
          
          {/* TAB 1: Why You? */}
          {activeTab === 'why-you' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-3">
                <div className="font-bold text-sm text-orange-900 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-orange-600" />
                  <span>Personalized Student-Problem Fit</span>
                </div>
                <p className="text-zinc-800 leading-relaxed text-xs sm:text-sm">
                  {whyYou.headline}
                </p>
                {whyYou.learningCurve && (
                  <div className="pt-2 border-t border-orange-200/60 text-xs text-orange-800">
                    <span className="font-bold">Growth Edge / Learning Curve: </span>
                    {whyYou.learningCurve}
                  </div>
                )}
              </div>

              {/* Skill Match Breakdown */}
              {whyYou.skillMatches && whyYou.skillMatches.length > 0 && (
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                  <h4 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-2">
                    Verified Competency Alignment
                  </h4>
                  <div className="space-y-3">
                    {whyYou.skillMatches.map((sm, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold text-zinc-800">
                          <span className="font-mono">{sm.skill}</span>
                          <span className="text-[11px] font-mono text-zinc-500">{sm.matchPercent || 85}% match</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-200 overflow-hidden">
                          <div 
                            className="h-full bg-orange-500 rounded-full transition-all"
                            style={{ width: `${sm.matchPercent || 85}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-zinc-600 italic mt-0.5">{sm.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Problem & Evidence */}
          {activeTab === 'problem' && (
            <div className="space-y-6 animate-fade-in">
              {/* Problem Description */}
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="font-bold text-sm text-[#FF5A43] flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>The Grounded Real-World Problem</span>
                </div>
                <p className="text-zinc-800 leading-relaxed text-xs sm:text-sm">
                  {activeOpportunity.theProblem?.summary}
                </p>
                <div className="pt-2 border-t border-zinc-200 text-xs text-zinc-600">
                  <span className="font-bold text-zinc-800">Who is affected: </span>
                  {activeOpportunity.theProblem?.affectedPopulation}
                </div>
              </div>

              {/* What's Missing? Gap Analysis */}
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-orange-600" />
                  <span>What is Missing? (Engineering Gap Analysis)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-white border border-zinc-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-zinc-500">Existing Approaches</div>
                    <p className="text-xs text-zinc-700">{whatsMissing.existingApproaches || activeOpportunity.existingSolutionsGap?.existingWork}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-rose-200 text-rose-900 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-rose-600">Critical Limitation</div>
                    <p className="text-xs text-rose-800">{whatsMissing.criticalLimitation || activeOpportunity.existingSolutionsGap?.whyTheyFailOrFallShort}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-emerald-200 text-emerald-900 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-emerald-600">Identified Opportunity</div>
                    <p className="text-xs text-emerald-800">{whatsMissing.identifiedOpportunity || activeOpportunity.studentOpportunity?.coreConcept}</p>
                  </div>
                </div>
              </div>

              {/* Evidence Hub */}
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <h4 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-1 flex items-center gap-2">
                  <Database className="h-4 w-4 text-zinc-700" />
                  <span>Verified Evidence Hub & Sources</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {evidence.map((ev, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-zinc-200 text-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-zinc-900">{ev.organization}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">{ev.year}</span>
                        </div>
                        <p className="text-[11px] text-zinc-600 mt-2 italic leading-relaxed">"{ev.finding}"</p>
                      </div>
                      {ev.link && (
                        <a 
                          href={ev.link} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="mt-3 flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                        >
                          <span>View Source</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Solution & Architecture */}
          {activeTab === 'solution' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-[#2DD4BF]" />
                  <span>The Proposed Solution</span>
                </div>
                <p className="text-zinc-800 leading-relaxed text-xs sm:text-sm">
                  {activeOpportunity.studentOpportunity?.coreConcept}
                </p>
                <div className="p-3 rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 text-xs text-zinc-900 font-medium">
                  <strong>Why your profile fits:</strong> {activeOpportunity.studentOpportunity?.whyStudentIsSuited}
                </div>
              </div>

              {/* System Architecture Box */}
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <h4 className="text-sm font-bold text-zinc-900 mb-2 border-b border-zinc-100 pb-1 flex items-center gap-2">
                  High-Level System Architecture
                </h4>
                <pre className="p-4 rounded-xl bg-zinc-900 text-[#2DD4BF] font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                  {activeOpportunity.studentOpportunity?.solutionArchitecture}
                </pre>
              </div>

              {/* Tech Stack Breakdown */}
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <h4 className="text-sm font-bold text-zinc-900 mb-3 border-b border-zinc-100 pb-1 flex items-center gap-2">
                  Recommended Technology Stack
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(activeOpportunity.studentOpportunity?.recommendedTechStack || {}).map(([layer, techs]) => (
                    <div key={layer} className="p-3 rounded-xl bg-white border border-zinc-200">
                      <div className="text-[10px] uppercase font-bold text-zinc-500 capitalize">{layer}</div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {techs.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-[10px] font-mono text-zinc-800 font-semibold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Build Reality Matrix */}
          {activeTab === 'feasibility' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
                <div className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-orange-600" />
                  <span>Build Feasibility & Grounding Matrix</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-zinc-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Skill Match Rating</span>
                    </div>
                    <div className="text-sm font-bold text-zinc-900">{buildReality.skillMatchRating || "85% High Match"}</div>
                    <p className="text-xs text-zinc-600 mt-1">{buildReality.skillMatchDetails || "Uses existing student tech competencies directly."}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-zinc-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1">
                      <Database className="h-3.5 w-3.5 text-blue-600" />
                      <span>Data Availability</span>
                    </div>
                    <div className="text-sm font-bold text-zinc-900">{buildReality.dataAvailability || "Open Datasets / APIs"}</div>
                    <p className="text-xs text-zinc-600 mt-1">{buildReality.dataSources || "Available via standard public repositories and sensors."}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-zinc-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1">
                      <Cpu className="h-3.5 w-3.5 text-purple-600" />
                      <span>Hardware Required</span>
                    </div>
                    <div className="text-sm font-bold text-zinc-900">{buildReality.hardwareRequired || "Standard Laptop / Cloud Free-tier"}</div>
                    <p className="text-xs text-zinc-600 mt-1">No expensive proprietary hardware or physical test rigs required.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-zinc-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                      <span>Complexity & Timeline</span>
                    </div>
                    <div className="text-sm font-bold text-zinc-900">{buildReality.complexity || "Medium"} ({buildReality.estimatedTimeline || "6-8 Weeks"})</div>
                    <p className="text-xs text-zinc-600 mt-1">{buildReality.targetTier || "Production / Final-Year Standard"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Roadmap */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-xs text-zinc-500">
                A staged week-by-week implementation plan structured to guarantee working deliverables at every stage.
              </div>
              <div className="space-y-3">
                {activeOpportunity.developmentRoadmap?.map((phase, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-start gap-4">
                    <div className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white font-mono font-bold text-xs shrink-0 mt-0.5">
                      {phase.phase}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900">{phase.title}</h4>
                      <p className="text-xs text-zinc-600 mt-1">{phase.deliverables}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Defense */}
          {activeTab === 'defense' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-[#FF5A43]" />
                  <span>Resume / CV Bullet Points</span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 font-mono">
                    [Bullet 1] {activeOpportunity.careerAndResumePack?.resumeBullet1}
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 font-mono">
                    [Bullet 2] {activeOpportunity.careerAndResumePack?.resumeBullet2}
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <h4 className="text-sm font-bold text-zinc-900 mb-2 border-b border-zinc-100 pb-1 flex items-center gap-2">
                  Interview Elevator Pitch
                </h4>
                <p className="text-xs text-zinc-700 italic leading-relaxed p-3.5 rounded-xl bg-white border border-zinc-200">
                  "{activeOpportunity.careerAndResumePack?.interviewTalkingPoint}"
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-zinc-200 bg-[#FAF8F5] flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSaveProject(activeOpportunity)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-[#FF5A43]/10 text-[#FF5A43] border-[#FF5A43]/30'
                    : 'bg-white text-zinc-700 hover:bg-zinc-100 border-zinc-300'
                }`}
              >
                {isSaved ? <BookmarkCheck className="h-4 w-4 text-[#FF5A43]" /> : <Bookmark className="h-4 w-4" />}
                <span>{isSaved ? 'Saved' : 'Save to Projects'}</span>
              </button>

              <button
                onClick={handleDownloadReadme}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-700 text-xs font-bold transition-all cursor-pointer"
              >
                <FileDown className="h-4 w-4" />
                <span>Export README.md</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleLaunchMentorMode}
            className="w-full py-4 rounded-2xl btn-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] cursor-pointer"
          >
            <Bot className="w-5 h-5 text-[#2DD4BF]" />
            <span>Launch into AI Mentor & Audit Mode</span>
          </button>
        </div>

      </div>
    </div>
  );
}
