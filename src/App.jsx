import React from 'react';
import Navbar from './components/Navbar';
import ProfileBuilder from './components/ProfileBuilder';
import ResearchTicker from './components/ResearchTicker';
import OpportunityCard from './components/OpportunityCard';
import OpportunityDetailModal from './components/OpportunityDetailModal';
import MentorChatModal from './components/MentorChatModal';
import SavedProjectsDrawer from './components/SavedProjectsDrawer';
import { RepoConnectModal } from './components/RepoConnectModal';
import { ProjectHealthView } from './components/ProjectHealthView';
import { VivaDefenseView } from './components/VivaDefenseView';
import { DocAuditorView } from './components/DocAuditorView';
import { MentorChatConsole } from './components/MentorChatConsole';
import WhyUsView from './components/WhyUsView';
import {
  HeroDeveloperIllustration,
  CardTechIllustration,
  CardStarsIllustration,
  CardSetupIllustration
} from './components/Illustrations';
import { useAppStore } from './lib/store';
import { discoverProjectOpportunities } from './lib/gemini';
import confetti from 'canvas-confetti';

export default function App() {
  const {
    activeTab,
    setActiveTab,
    profile,
    apiKey,
    opportunities,
    setOpportunities,
    discoveryStatus,
    setDiscoveryStatus,
    addResearchLog,
    clearResearchLogs,
    repoData,
    setRepoModalOpen,
    mentorProjectContext
  } = useAppStore();

  const handleLaunchDiscovery = async () => {
    if (discoveryStatus === 'analyzing' || discoveryStatus === 'researching') return;

    clearResearchLogs();
    setDiscoveryStatus('analyzing');

    // Smooth scroll to ticker directly under profile builder
    setTimeout(() => {
      const tickerEl = document.getElementById('discovery-ticker');
      if (tickerEl) tickerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    try {
      const results = await discoverProjectOpportunities(profile, apiKey, addResearchLog);
      setOpportunities(results);
      setDiscoveryStatus('completed');
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });

      setTimeout(() => {
        const resultsEl = document.getElementById('discovery-results');
        if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth' });
      }, 800);
    } catch (err) {
      console.error(err);
      setDiscoveryStatus('error');
    }
  };

  return (
    <div className="min-h-screen text-zinc-900 flex flex-col justify-between selection:bg-zinc-200">

      {/* Clean Navbar */}
      <Navbar />
      <RepoConnectModal />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-4 space-y-20 w-full">

        {/* ==================================================== */}
        {/* TAB 1: PROBLEM DISCOVERY */}
        {/* ==================================================== */}
        {activeTab === 'discovery' && (
          <div className="space-y-10 animate-fade-in">

            {/* Minimalist High-Impact Hero Section */}
            <section className="text-center max-w-4xl mx-auto space-y-8">


              <div className="space-y-6">
                <h1 className="font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-zinc-900 tracking-tight leading-[1.05]">
                  Find a real <span className="text-orange-500">problem</span><br />
                  for final year <span className="text-orange-500">project</span> &amp; viva
                </h1>
                <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-500 font-medium leading-relaxed">
                  Stop building generic clones. Discover unique problem statements, audit your repository against academic rubrics, and simulate your final defense with an expert AI examiner.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => {
                    const formEl = document.getElementById('profile-section');
                    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 font-bold text-sm btn-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                >
                  Start Discovery Scan
                </button>
                <button
                  onClick={() => setActiveTab('health')}
                  className="px-8 py-4 font-bold text-sm bg-white border border-zinc-200 text-zinc-800 rounded-xl shadow-sm hover:border-zinc-300 hover:bg-zinc-50 transition-all w-full sm:w-auto"
                >
                  Connect GitHub Repo
                </button>
              </div>

              {/* Large Character Illustration - using mix-blend-multiply to remove white bg */}
              <div className="pt-2 flex justify-center">
                <HeroDeveloperIllustration className="w-full max-w-2xl h-auto mix-blend-multiply" />
              </div>
            </section>

            {/* Exactly Styled 3-Card Section Matching Reference */}
            <section className="space-y-10">
              <h2 className="font-black text-3xl sm:text-4xl text-zinc-900 text-center tracking-tight">
                What you'll find on Project Scout
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Card 1 */}
                <div
                  onClick={() => setActiveTab('discovery')}
                  className="bg-white p-8 border border-zinc-200 shadow-sm flex flex-col items-center text-center space-y-6 hover:border-zinc-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="h-44 flex items-center justify-center">
                    <CardTechIllustration className="w-44 h-auto" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-zinc-900">
                      A variety of technologies
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                      From Python and PyTorch to React, FastAPI and Rust, Project Scout covers all domains and stacks.
                    </p>
                  </div>
                </div>

                {/* Card 2 */}
                <div
                  onClick={() => setActiveTab('chat')}
                  className="bg-white p-8 border border-zinc-200 shadow-sm flex flex-col items-center text-center space-y-6 hover:border-zinc-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="h-44 flex items-center justify-center">
                    <CardStarsIllustration className="w-44 h-auto" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-zinc-900">
                      Code help from AI
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                      Connect your GitHub repo for continuous technical reviews, architecture guidance, and viva preparation.
                    </p>
                  </div>
                </div>

                {/* Card 3 */}
                <div
                  onClick={() => setActiveTab('health')}
                  className="bg-white p-8 border border-zinc-200 shadow-sm flex flex-col items-center text-center space-y-6 hover:border-zinc-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="h-44 flex items-center justify-center">
                    <CardSetupIllustration className="w-44 h-auto" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-zinc-900">
                      Effortless setup
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                      Upload your resume PDF or connect a GitHub repository in seconds to get immediate project health scores.
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* Profile Builder Section (with PDF Upload & Direct Results below) */}
            <section id="profile-section" className="pt-4 space-y-8">
              <ProfileBuilder onStartDiscovery={handleLaunchDiscovery} />

              {/* Live Research Ticker directly below Profile Builder */}
              <div id="discovery-ticker">
                <ResearchTicker />
              </div>

              {/* Discovered Opportunities Grid directly below Research Ticker */}
              {opportunities.length > 0 && (
                <div id="discovery-results" className="space-y-6 pt-2 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
                    <div>
                      <h2 className="font-black text-2xl text-zinc-900">
                        Discovered Project Opportunities ({opportunities.length})
                      </h2>
                      <p className="text-xs text-zinc-600 mt-1">
                        Matched to your <span className="font-bold">{profile.academicLevel}</span> profile in <span className="font-bold">{profile.domain}</span>.
                      </p>
                    </div>

                    <button
                      onClick={handleLaunchDiscovery}
                      className="px-4 py-2 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-800 border border-zinc-200 shadow-xs transition-all shrink-0 cursor-pointer"
                    >
                      Re-Run Discovery Scan
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {opportunities.map((opp, idx) => (
                      <OpportunityCard key={opp.id || idx} opportunity={opp} rank={idx + 1} />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* SECTION 1: How the Platform Works (Visual Workflow) */}
            <section className="space-y-8 pt-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <div className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">End-to-End Pipeline</div>
                <h2 className="font-black text-3xl sm:text-4xl text-zinc-900 tracking-tight">
                  How Project Scout accelerates your capstone
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500">
                  From discovering unaddressed industry gaps to simulating high-pressure viva defense scenarios.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    step: '01',
                    title: 'Skill & PDF Ingestion',
                    desc: 'Parse your technical stack, academic tier (UG/PG/PhD), and research interests from your resume or manual profile.',
                    tag: 'Input Engine'
                  },
                  {
                    step: '02',
                    title: 'Deep Problem Synthesis',
                    desc: 'Generate grounded problem statements complete with baseline benchmarks, mathematical modeling, and evaluation metrics.',
                    tag: 'Gemini 2.5'
                  },
                  {
                    step: '03',
                    title: 'Repository Health Audit',
                    desc: 'Connect GitHub to analyze commit velocity, test coverage, dependency freshness, and IEEE capstone README compliance.',
                    tag: 'Live Triage'
                  },
                  {
                    step: '04',
                    title: 'Viva Defense Simulator',
                    desc: 'Face ruthless external examiner AI agents that probe your baseline compromises, algorithmic complexity, and tradeoffs.',
                    tag: 'Oral Defense'
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 border border-zinc-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-zinc-400 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-2xl text-orange-500">{item.step}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-zinc-100 text-zinc-600 border border-zinc-200">
                        {item.tag}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-zinc-900 mb-1.5">{item.title}</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 2: Architecture & Live Review Spotlight (With user illustrations) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

              {/* Card with Asset 1 */}
              <div className="bg-white p-8 border border-zinc-200 shadow-xs flex flex-col justify-between space-y-6 hover:border-zinc-300 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 border border-orange-200 inline-block">
                      Real-Time AI Examination
                    </span>
                    <h3 className="font-black text-2xl text-zinc-900 tracking-tight">
                      Simulate Ruthless Academic Viva Defenses
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Examiners will drill down into why you chose specific baseline algorithms over state-of-the-art models. Project Scout generates comprehensive defense counter-arguments with mathematical citations.
                    </p>
                  </div>
                  <div className="w-28 h-28 shrink-0 flex items-center justify-center p-2">
                    <img
                      src="/asset-badge-1.png"
                      alt="Viva Discussion"
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </div>
                </div>

                <div className="bg-zinc-50 p-4 border border-zinc-200 space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-zinc-500 text-[10px] border-b border-zinc-200 pb-1">
                    <span>EXAMINER_PROMPT_SIMULATOR</span>
                    <span className="text-orange-600 font-bold">LIVE AGENT</span>
                  </div>
                  <div className="text-zinc-700">
                    <strong className="text-zinc-900">Examiner:</strong> "Why did you use CNN-LSTM instead of Vision Transformers for temporal sequence classification?"
                  </div>
                  <div className="text-zinc-600 bg-white p-2.5 border border-zinc-200 text-[10px] leading-relaxed">
                    <strong className="text-orange-600">Generated Defense:</strong> "ViTs exhibit quadratic memory complexity O(N^2) on edge device constraints. Our CNN-LSTM hybrid achieved 94.2% F1 score with 8.4x lower latency on 4GB memory budgets."
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('viva')}
                  className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  Open Viva Defense Simulator
                </button>
              </div>

              {/* Card with Asset 2 */}
              <div className="bg-white p-8 border border-zinc-200 shadow-xs flex flex-col justify-between space-y-6 hover:border-zinc-300 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 bg-zinc-100 px-2 py-0.5 border border-zinc-200 inline-block">
                      Automated Codebase Triage
                    </span>
                    <h3 className="font-black text-2xl text-zinc-900 tracking-tight">
                      Continuous Repository Health & Capstone Auditing
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Connect your GitHub repo to inspect test coverage, commit distribution, and documentation completeness against strict university project guidelines.
                    </p>
                  </div>
                  <div className="w-28 h-28 shrink-0 flex items-center justify-center p-2">
                    <img
                      src="/asset-badge-2.png"
                      alt="Code Triage"
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </div>
                </div>

                <div className="bg-zinc-950 text-zinc-300 p-4 border border-zinc-800 space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-zinc-500 text-[10px] border-b border-zinc-800 pb-1">
                    <span>CAPSTONE_HEALTH_AUDIT</span>
                    <span className="text-emerald-400 font-bold">READY</span>
                  </div>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">IEEE Methodology Specification:</span>
                      <span className="text-amber-400 font-bold">Needs Expansion (40/100)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Baseline Comparative Matrix:</span>
                      <span className="text-emerald-400 font-bold">Passed (92/100)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Reproducibility & Setup Scripts:</span>
                      <span className="text-emerald-400 font-bold">Automated (100/100)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('health')}
                  className="w-full py-3 bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-300 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  Connect GitHub Repo for Audit
                </button>
              </div>

            </section>



            {/* SECTION 4: 10-Point Academic Capstone Rubric */}
            <section className="bg-zinc-900 text-white p-8 sm:p-10 border border-zinc-800 shadow-md space-y-6">
              <div className="max-w-2xl space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-orange-400">Grading Standards</div>
                <h2 className="font-black text-2xl sm:text-3xl tracking-tight text-white">
                  Engineered strictly against top university rubrics
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Every problem discovered and repository audited on Project Scout satisfies the rigorous criteria used by faculty examination boards.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {[
                  { num: '01', title: 'Novelty & Gap Analysis', desc: 'Distinguishes between a boilerplate CRUD tutorial and a genuine architectural contribution.' },
                  { num: '02', title: 'Baseline Comparative Metrics', desc: 'Requires quantitative benchmark comparison against existing state-of-the-art implementations.' },
                  { num: '03', title: 'Mathematical Formulation', desc: 'Formalizes objectives, loss functions, or computational complexity proofs.' },
                  { num: '04', title: 'Deterministic Reproducibility', desc: 'Enforces complete dependency pinning, Dockerfiles, and automated setup verification.' },
                  { num: '05', title: 'Fault & Edge-Case Tolerance', desc: 'Tests behavior under memory degradation, network partitioning, and malformed inputs.' },
                  { num: '06', title: 'Viva Defense Readiness', desc: 'Anticipates counter-inquiries, limitation acknowledgments, and future scope defenses.' }
                ].map((rub, i) => (
                  <div key={i} className="bg-zinc-800/80 p-5 border border-zinc-700/80 space-y-2">
                    <span className="font-mono font-bold text-xs text-orange-400">{rub.num}</span>
                    <h3 className="font-bold text-sm text-zinc-100">{rub.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{rub.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 5: Frequently Asked Questions */}
            <section className="bg-white p-8 border border-zinc-200 shadow-xs space-y-6">
              <div className="border-b border-zinc-200 pb-4">
                <h2 className="font-black text-2xl text-zinc-900 tracking-tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Common queries regarding project discovery, repo audits, and viva simulations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    q: 'How does Project Scout discover real problems?',
                    a: 'Project Scout analyzes your profile and domain with Gemini 2.5 to synthesize unaddressed engineering gaps, industry pain points, and current academic benchmarks instead of producing clone ideas.'
                  },
                  {
                    q: 'Do I need to connect a GitHub repository?',
                    a: 'You can discover project ideas without connecting GitHub. However, connecting your repository unlocks live code health analysis, commit velocity auditing, and the interactive Viva Defense Simulator.'
                  },
                  {
                    q: 'What if my repository is private?',
                    a: 'You can provide a GitHub Personal Access Token with read-only repository scope, or manually paste your README and documentation into the Document Auditor.'
                  },
                  {
                    q: 'How does the Viva Defense Simulator prepare me?',
                    a: 'The simulator acts as a rigorous academic examiner who asks deep questions regarding architectural trade-offs, algorithmic bottlenecks, and validation flaws to prepare you for actual committee evaluations.'
                  }
                ].map((faq, i) => (
                  <div key={i} className="p-5 bg-zinc-50 border border-zinc-200 space-y-2">
                    <h3 className="font-bold text-sm text-zinc-900">{faq.q}</h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: REPO HEALTH CHECK & ACADEMIC AUDIT */}
        {/* ==================================================== */}
        {activeTab === 'health' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Repository Health & Academic Audit • Tier: {mentorProjectContext.academicLevel || 'UG'}
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                  {repoData ? (mentorProjectContext.problem || repoData.name) : 'No Repository Connected'}
                </h1>
                <p className="text-xs text-zinc-600 max-w-2xl line-clamp-1">
                  {repoData ? (
                    <><strong>Plan:</strong> {mentorProjectContext.plan || 'Continuous code audit and viva defense preparation'}</>
                  ) : (
                    'Please connect a GitHub repository to begin.'
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {repoData ? (
                  <div className="p-3 bg-zinc-50 border border-zinc-200 flex items-center gap-3">
                    <div>
                      <div className="text-xs font-bold text-zinc-900">
                        {repoData.owner}/{repoData.name}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {repoData.fileTree?.length || 0} files indexed
                      </div>
                    </div>
                    <button
                      onClick={() => setRepoModalOpen(true)}
                      className="p-1.5 bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 text-xs font-bold transition-colors ml-2 cursor-pointer"
                    >
                      Switch Repo
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setRepoModalOpen(true)}
                    className="px-6 py-3 btn-black text-xs font-bold shadow-md cursor-pointer"
                  >
                    Connect GitHub Repository
                  </button>
                )}
              </div>
            </div>

            <ProjectHealthView />
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: VIVA DEFENSE */}
        {/* ==================================================== */}
        {activeTab === 'viva' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 bg-white border border-zinc-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-zinc-900">Viva Examination Defense Simulator</h2>
                <p className="text-xs text-zinc-600 mt-1 font-normal">
                  Anticipate tough external examiner traps, flawed baseline queries, and model defenses.
                </p>
              </div>
              {!repoData && (
                <button
                  onClick={() => setRepoModalOpen(true)}
                  className="px-5 py-2.5 btn-black text-xs font-bold cursor-pointer"
                >
                  Connect Repo First
                </button>
              )}
            </div>
            <VivaDefenseView />
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: DOCUMENTATION AUDIT */}
        {/* ==================================================== */}
        {activeTab === 'docs' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 bg-white border border-zinc-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-zinc-900">10-Point Capstone Documentation Rubric</h2>
                <p className="text-xs text-zinc-600 mt-1 font-normal">
                  Audit your README against IEEE/ACM capstone report requirements and 1-click generate missing sections.
                </p>
              </div>
              {!repoData && (
                <button
                  onClick={() => setRepoModalOpen(true)}
                  className="px-5 py-2.5 btn-black text-xs font-bold cursor-pointer"
                >
                  Connect Repo
                </button>
              )}
            </div>
            <DocAuditorView />
          </div>
        )}

        {/* ==================================================== */}
        {/* ==================================================== */}
        {/* TAB: WHY US */}
        {/* ==================================================== */}
        {activeTab === 'why-us' && (
          <WhyUsView />
        )}

        {/* ==================================================== */}
        {/* TAB 5: AI MENTOR CHAT */}
        {/* ==================================================== */}
        {activeTab === 'chat' && (
          <div className="space-y-6 animate-fade-in">
            <MentorChatConsole />
          </div>
        )}

      </main>

      {/* Global Modals & Drawers */}
      <OpportunityDetailModal />
      <MentorChatModal />
      <SavedProjectsDrawer />

      {/* Clean Footer */}
      <footer className="border-t border-zinc-200 bg-white py-8 mt-20 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-bold text-zinc-900">
            <span className="text-orange-500">Project</span> Scout
          </div>
          <div className="text-[11px] text-zinc-500">
            Real-World Problem Discovery & Capstone Repository Intelligence Engine
          </div>
        </div>
      </footer>

    </div>
  );
}
