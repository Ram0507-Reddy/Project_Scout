import React, { useState } from 'react';
import { UploadCloud, FileText, Sparkles, Plus, X, Cpu, Globe2, Layers, Clock, Users, Shield, BookOpen, HeartPulse, Stethoscope, Sprout, Landmark, Scale, Feather } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { parseResumeWithGemini } from '../lib/resumeParser';

export default function ProfileBuilder({ onStartDiscovery }) {
  const { profile, setProfile, apiKey, addResearchLog } = useAppStore();
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'resume'
  const [rawResume, setRawResume] = useState('');
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newTool, setNewTool] = useState('');

  // Universal Domains List
  const universalDomains = [
    { id: 'Computer Science & AI/ML', icon: <Cpu className="h-4 w-4" />, label: 'CS & AI / Machine Learning' },
    { id: 'Cybersecurity & Privacy', icon: <Shield className="h-4 w-4" />, label: 'Cybersecurity & Threat Intel' },
    { id: 'Healthcare, Medicine & Biotech', icon: <Stethoscope className="h-4 w-4" />, label: 'Healthcare & Medicine' },
    { id: 'Agriculture, Climate & Environment', icon: <Sprout className="h-4 w-4" />, label: 'Agriculture & Climate Tech' },
    { id: 'Economics, Fintech & Business', icon: <Landmark className="h-4 w-4" />, label: 'Economics & Fintech' },
    { id: 'Legal Tech, Ethics & Governance', icon: <Scale className="h-4 w-4" />, label: 'Law & Algorithmic Ethics' },
    { id: 'Literature, Arts & Digital Humanities', icon: <Feather className="h-4 w-4" />, label: 'Literature & Humanities' },
    { id: 'Robotics, IoT & Embedded Systems', icon: <Layers className="h-4 w-4" />, label: 'IoT & Hardware Systems' }
  ];

  const academicLevels = [
    { id: 'UG', title: 'Undergraduate (UG)', desc: 'Focus on working software, system design & high utility' },
    { id: 'PG', title: 'Postgraduate (PG)', desc: 'Focus on empirical benchmarks, datasets & rigorous metrics' },
    { id: 'PhD', title: 'Doctorate (PhD)', desc: 'Focus on novel methodology, theoretical gaps & publications' }
  ];

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ skills: [...profile.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile({ skills: profile.skills.filter((s) => s !== skillToRemove) });
  };

  const handleAddTool = (e) => {
    e.preventDefault();
    if (newTool.trim() && !profile.tools.includes(newTool.trim())) {
      setProfile({ tools: [...profile.tools, newTool.trim()] });
      setNewTool('');
    }
  };

  const handleRemoveTool = (toolToRemove) => {
    setProfile({ tools: profile.tools.filter((t) => t !== toolToRemove) });
  };

  const handleResumeExtract = async () => {
    if (!rawResume.trim()) return;
    setIsParsingResume(true);
    try {
      const extracted = await parseResumeWithGemini(rawResume, apiKey);
      setProfile({
        academicLevel: extracted.academicLevel || profile.academicLevel,
        domain: extracted.domain || profile.domain,
        skills: extracted.skills?.length ? extracted.skills : profile.skills,
        tools: extracted.tools?.length ? extracted.tools : profile.tools,
        interests: extracted.interests || profile.interests,
        resumeText: rawResume
      });
      setActiveTab('manual');
    } catch (err) {
      console.error(err);
    } finally {
      setIsParsingResume(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Stage 1: Student Capability & Interest Profile</span>
        </div>
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight">
          What are you capable of building?
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Project Scout uses your exact skills and constraints to scour real-world data and locate problems you are uniquely positioned to solve.
        </p>

        {/* Input Mode Toggle */}
        <div className="flex items-center justify-center gap-2 mt-6 p-1 bg-slate-900/80 rounded-2xl border border-white/5 max-w-xs mx-auto">
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'manual'
                ? 'bg-cyan-500 text-white shadow-lg glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Custom Profile
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'resume'
                ? 'bg-cyan-500 text-white shadow-lg glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Resume / Bio
          </button>
        </div>
      </div>

      {/* Tab 1: Resume Parser */}
      {activeTab === 'resume' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5">
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>Paste Resume Text, Bio, or Project Portfolio</span>
              <span className="text-[10px] text-slate-500 font-mono">Gemini Auto-Extraction</span>
            </label>
            <textarea
              rows={6}
              value={rawResume}
              onChange={(e) => setRawResume(e.target.value)}
              placeholder="Paste your resume content, experience bullet points, courses completed, or GitHub bio here..."
              className="w-full p-3.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <button
            onClick={handleResumeExtract}
            disabled={isParsingResume || !rawResume.trim()}
            className="w-full py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isParsingResume ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Extracting Skills & Capabilities via Gemini...</span>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                <span>Auto-Fill Profile from Resume</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Tab 2: Manual Profile Builder */}
      {activeTab === 'manual' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Academic Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2.5">
              1. Select Academic Calibration Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {academicLevels.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setProfile({ academicLevel: lvl.id })}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    profile.academicLevel === lvl.id
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-white glow-cyan'
                      : 'bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="font-heading font-bold text-xs text-slate-200">{lvl.title}</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Universal Domain Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2.5">
              2. Target Domain & Discipline (Universal)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {universalDomains.map((dom) => (
                <button
                  key={dom.id}
                  onClick={() => setProfile({ domain: dom.id })}
                  className={`p-3 rounded-xl text-left border text-xs transition-all flex flex-col justify-between gap-2 ${
                    profile.domain === dom.id
                      ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-500/50 text-white'
                      : 'bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg w-fit ${profile.domain === dom.id ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {dom.icon}
                  </div>
                  <span className="font-medium text-[11px]">{dom.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Skills & Capabilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Primary Skills */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                3. Primary Competencies & Skills
              </label>
              <form onSubmit={handleAddSkill} className="flex gap-1.5 mb-2.5">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g. Computer Vision, Cryptography..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
                <button type="submit" className="p-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30">
                  <Plus className="h-4 w-4" />
                </button>
              </form>
              <div className="flex flex-wrap gap-1.5 min-h-[50px]">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-medium"
                  >
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-cyan-100">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Tools & Frameworks */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                4. Frameworks & Technologies
              </label>
              <form onSubmit={handleAddTool} className="flex gap-1.5 mb-2.5">
                <input
                  type="text"
                  value={newTool}
                  onChange={(e) => setNewTool(e.target.value)}
                  placeholder="e.g. FastAPI, Docker, PyTorch..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
                <button type="submit" className="p-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30">
                  <Plus className="h-4 w-4" />
                </button>
              </form>
              <div className="flex flex-wrap gap-1.5 min-h-[50px]">
                {profile.tools.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-medium"
                  >
                    {tool}
                    <button type="button" onClick={() => handleRemoveTool(tool)} className="hover:text-blue-100">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Core Interests & Constraints */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                5. Passions, Societal Problems or Areas of Curiosity
              </label>
              <input
                type="text"
                value={profile.interests}
                onChange={(e) => setProfile({ interests: e.target.value })}
                placeholder="e.g. I want to build solutions for real-time safety, assistive technologies, or low-bandwidth users"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Timeline</label>
                <select
                  value={profile.timeline}
                  onChange={(e) => setProfile({ timeline: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none"
                >
                  <option>1 Month (Speed Hack)</option>
                  <option>3 Months (Final Semester)</option>
                  <option>6 Months (Full Year Thesis)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Constraints / Budget</label>
                <input
                  type="text"
                  value={profile.constraints}
                  onChange={(e) => setProfile({ constraints: e.target.value })}
                  placeholder="e.g. Free tier deployment only, no hardware needed"
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={onStartDiscovery}
              className="w-full py-4 rounded-2xl font-heading font-bold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:opacity-95 transition-all shadow-xl glow-cyan flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <Sparkles className="h-5 w-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span>Launch Multi-Stage Problem Discovery Engine</span>
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              Gemini will scan 2025/2026 web reports, CVEs, research gaps, and score feasibility against your profile.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
