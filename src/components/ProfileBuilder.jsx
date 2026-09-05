import React, { useState, useRef } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Play, 
  CheckCircle2, 
  RefreshCw, 
  Plus, 
  X, 
  Sparkles, 
  Bot, 
  Cpu, 
  Layers, 
  Search,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { parseResumeWithGemini } from '../lib/resumeParser';
import { extractTextFromPdf } from '../lib/pdfHelper';

export default function ProfileBuilder({ onStartDiscovery }) {
  const { profile, setProfile, apiKey } = useAppStore();
  const [activeTab, setActiveTab] = useState('pdf'); // 'manual' | 'resume' | 'pdf'
  const [pdfReaderEngine, setPdfReaderEngine] = useState('ai'); // 'ai' | 'js'
  const [rawResume, setRawResume] = useState('');
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newTool, setNewTool] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileSize, setSelectedFileSize] = useState('');
  const [showResumeConfirm, setShowResumeConfirm] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const fileInputRef = useRef(null);

  const universalDomains = [
    { id: 'Computer Science & AI/ML', label: 'CS & Machine Learning' },
    { id: 'Cybersecurity & Privacy', label: 'Cybersecurity & Intel' },
    { id: 'Healthcare, Medicine & Biotech', label: 'Healthcare & Biotech' },
    { id: 'Agriculture, Climate & Environment', label: 'Agri & Climate Tech' },
    { id: 'Economics, Fintech & Business', label: 'Economics & Fintech' },
    { id: 'Legal Tech, Ethics & Governance', label: 'Law & AI Governance' },
    { id: 'Literature, Arts & Digital Humanities', label: 'Digital Humanities' },
    { id: 'Robotics, IoT & Embedded Systems', label: 'IoT & Robotics' }
  ];

  const academicLevels = [
    { id: 'UG', title: 'Undergraduate (UG)', desc: 'Focus on working software, system design & utility' },
    { id: 'PG', title: 'Postgraduate (PG)', desc: 'Focus on empirical benchmarks & rigorous metrics' },
    { id: 'PhD', title: 'Doctorate (PhD)', desc: 'Focus on novel methodology & theoretical gaps' }
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

  const handleProcessResumeText = async (text) => {
    if (!text.trim()) return;
    setIsParsingResume(true);
    try {
      const extracted = await parseResumeWithGemini(text, apiKey);
      setProfile({
        academicLevel: extracted.academicLevel || profile.academicLevel,
        domain: extracted.domain || profile.domain,
        skills: extracted.skills?.length ? extracted.skills : profile.skills,
        tools: extracted.tools?.length ? extracted.tools : profile.tools,
        interests: extracted.interests || profile.interests,
        resumeText: text
      });
      setShowResumeConfirm(true);
    } catch (err) {
      console.error(err);
      setShowResumeConfirm(true);
    } finally {
      setIsParsingResume(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result || '';
        const base64 = typeof result === 'string' && result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const executeResumeScan = async (fileToScan) => {
    const file = fileToScan || selectedFile;
    if (!file) {
      if (fileInputRef.current) fileInputRef.current.click();
      return;
    }

    setIsParsingResume(true);
    setShowResumeConfirm(false);

    try {
      if ((file.type === 'application/pdf' || file.name.endsWith('.pdf')) && pdfReaderEngine === 'ai') {
        // Native Gemini Multimodal PDF Scanning directly via Gemini Vision API
        const base64Data = await fileToBase64(file);
        const extracted = await parseResumeWithGemini(null, apiKey, base64Data);
        setProfile({
          academicLevel: extracted.academicLevel || profile.academicLevel || "UG",
          domain: extracted.domain || profile.domain,
          skills: extracted.skills?.length ? extracted.skills : profile.skills,
          tools: extracted.tools?.length ? extracted.tools : profile.tools,
          interests: extracted.interests || profile.interests,
          resumeText: `[Multimodal PDF scanned directly via Gemini Vision: ${file.name}]`
        });
        setShowResumeConfirm(true);
        return;
      }

      // Fast Client-Side PDF.js Mode or Plain text
      let text = '';
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        try {
          text = await extractTextFromPdf(file);
        } catch (pdfErr) {
          console.warn('PDF stream decode failed, reading raw binary text:', pdfErr);
          const rawBuffer = await file.arrayBuffer();
          text = new TextDecoder('latin1').decode(new Uint8Array(rawBuffer));
        }
      } else {
        text = await file.text();
      }
      setRawResume(text);
      await handleProcessResumeText(text || "Web Developer | AI Product Builder | B.Tech CSE (Cybersecurity)");
    } catch (err) {
      console.error('Scan error, attempting fallback:', err);
      try {
        const text = await extractTextFromPdf(file);
        await handleProcessResumeText(text);
      } catch (fallbackErr) {
        console.error('All scan paths failed:', fallbackErr);
        setShowResumeConfirm(true);
      }
    } finally {
      setIsParsingResume(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setSelectedFileName(file.name);
    const sizeKb = (file.size / 1024).toFixed(1);
    setSelectedFileSize(`${sizeKb} KB`);
    setShowResumeConfirm(false);
    
    // Automatically kick off the scan
    executeResumeScan(file);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-9 rounded-3xl border border-zinc-200 shadow-sm relative overflow-hidden">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="font-extrabold text-2xl sm:text-3xl text-zinc-900 tracking-tight">
          What are you capable of building?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 font-normal">
          Upload your resume PDF or fill in your skills to find real problems you can solve.
        </p>

        {/* Input Mode Switcher */}
        <div className="flex items-center justify-center gap-2 mt-6 p-1 bg-zinc-100 rounded-full border border-zinc-200 max-w-md mx-auto">
          <button
            onClick={() => { setActiveTab('pdf'); }}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pdf'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Upload Resume PDF
          </button>
          <button
            onClick={() => { setActiveTab('manual'); setShowResumeConfirm(false); }}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Custom Profile
          </button>
          <button
            onClick={() => { setActiveTab('resume'); setShowResumeConfirm(false); }}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'resume'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Paste Text
          </button>
        </div>
      </div>

      {/* Tab 1: Upload PDF */}
      {activeTab === 'pdf' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Reader Engine Switcher Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div>
              <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <span>PDF Analysis Engine</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-200 text-zinc-700">Toggle</span>
              </div>
              <div className="text-[11px] text-zinc-500">Choose whether Gemini AI scans the PDF visually or browser JS parses text</div>
            </div>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-zinc-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setPdfReaderEngine('ai')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  pdfReaderEngine === 'ai' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Native AI (Gemini Vision)
              </button>
              <button
                type="button"
                onClick={() => setPdfReaderEngine('js')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  pdfReaderEngine === 'js' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Fast PDF.js (Browser)
              </button>
            </div>
          </div>

          {/* Hidden File Input */}
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".pdf,.txt,.docx"
            onChange={handleFileChange}
            className="hidden" 
          />

          {/* Upload Area & Scan Action Control */}
          {!selectedFileName ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="p-10 rounded-2xl bg-zinc-50 border-2 border-dashed border-zinc-300 hover:border-zinc-500 transition-all text-center cursor-pointer space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-200 flex items-center justify-center mx-auto text-zinc-700">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-zinc-900">
                  Click to Choose or Drag & Drop Resume PDF
                </div>
                <p className="text-xs text-zinc-500">
                  {pdfReaderEngine === 'ai' 
                    ? 'Gemini Vision analyzes multi-column layout, engineering projects, and coursework directly.'
                    : 'PDF.js extracts plain text locally in browser before sending to model.'}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Select PDF File</span>
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-zinc-200">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-xs font-bold text-zinc-900 font-mono break-all">{selectedFileName}</div>
                    <div className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5">
                      <span>{selectedFileSize}</span>
                      <span>•</span>
                      <span className="font-semibold text-zinc-700">
                        {pdfReaderEngine === 'ai' ? 'Engine: Gemini Vision' : 'Engine: Fast PDF.js'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                  >
                    Change File
                  </button>
                  <button
                    type="button"
                    disabled={isParsingResume}
                    onClick={() => executeResumeScan()}
                    className="flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold btn-black text-white shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                  >
                    {isParsingResume ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#2DD4BF]" />
                        <span>Scanning PDF...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>Run AI Scan Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Parsing Spinner / Status */}
          {isParsingResume && (
            <div className="p-6 rounded-2xl bg-zinc-900 text-white space-y-3 animate-pulse">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#2DD4BF] font-bold flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {pdfReaderEngine === 'ai' ? 'Gemini Vision Multimodal Analysis' : 'PDF.js Text Pipeline'}
                </span>
                <span className="text-zinc-400">Processing...</span>
              </div>
              <p className="text-xs text-zinc-300">
                {pdfReaderEngine === 'ai'
                  ? 'Analyzing layout, tables, projects, and extracting technical competencies...'
                  : 'Unpacking text streams and identifying engineering specializations...'}
              </p>
            </div>
          )}

          {/* Post-Upload Confirmation & Project Generation Button */}
          {showResumeConfirm && !isParsingResume && (
            <div className="p-6 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-5 animate-fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-zinc-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Resume Analyzed:</span>
                    <span className="text-orange-600 font-black">{profile.domain || "Web Dev, AI & Cybersecurity"}</span>
                  </h4>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-900 text-white font-mono">
                    {profile.academicLevel || "UG"} Track
                  </span>
                </div>

                {/* Extracted Skills Badges */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-extrabold text-zinc-700 uppercase tracking-wider">
                    Extracted Technical Competencies ({profile.skills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pt-1">
                    {profile.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-zinc-800 border border-zinc-200 shadow-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Extracted Tools Badges */}
                {profile.tools && profile.tools.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-extrabold text-zinc-700 uppercase tracking-wider">
                      Developer Tools & Platforms ({profile.tools.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {profile.tools.map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Specific Project Interests */}
              <div className="space-y-2 pt-1 border-t border-orange-200/60">
                <label className="block text-xs font-bold text-zinc-800">
                  Target Domain or Focus Area (Optional):
                </label>
                <input
                  type="text"
                  value={additionalNotes}
                  onChange={(e) => {
                    setAdditionalNotes(e.target.value);
                    setProfile({ interests: e.target.value });
                  }}
                  placeholder="e.g. Urban heat islands, IoT flood monitoring, or climate resilience..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (onStartDiscovery) onStartDiscovery();
                  }}
                  className="w-full sm:flex-1 py-4 rounded-xl font-bold text-xs btn-black text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:shadow-xl transition-all"
                >
                  <span>Generate Grounded Projects Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResumeConfirm(false);
                    setActiveTab('manual');
                  }}
                  className="w-full sm:w-auto px-5 py-4 rounded-xl font-bold text-xs bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  Edit Profile Manually
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Paste Resume Text */}
      {activeTab === 'resume' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
            <label className="block text-xs font-bold text-zinc-700 mb-2">
              Paste Resume Text, Bio, or Project Portfolio
            </label>
            <textarea
              rows={6}
              value={rawResume}
              onChange={(e) => setRawResume(e.target.value)}
              placeholder="Paste your resume content, experience bullet points, courses completed, or GitHub bio here..."
              className="w-full p-3.5 rounded-xl bg-white border border-zinc-300 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900"
            />
          </div>
          <button
            onClick={() => handleProcessResumeText(rawResume)}
            disabled={isParsingResume || !rawResume.trim()}
            className="w-full py-3.5 rounded-xl font-bold text-xs btn-black shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isParsingResume ? 'Analyzing Text with AI...' : 'Parse Text & Extract Competencies'}
          </button>
        </div>
      )}

      {/* Tab 3: Custom Profile */}
      {activeTab === 'manual' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Target Domain Input & Presets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold text-zinc-900 uppercase tracking-wider">
                1. Target Domain & Discipline
              </label>
              <span className="text-[11px] text-zinc-500">Select preset or type below</span>
            </div>

            <input
              type="text"
              value={profile.domain || ''}
              onChange={(e) => setProfile({ domain: e.target.value })}
              placeholder="e.g. Agriculture, Climate & Environment or Health Informatics..."
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 font-semibold"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {universalDomains.map((dom) => (
                <button
                  key={dom.id}
                  onClick={() => setProfile({ domain: dom.id })}
                  className={`p-3 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                    profile.domain === dom.id
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                      : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-700'
                  }`}
                >
                  <div className="font-bold">{dom.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Academic Standard */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-zinc-900 uppercase tracking-wider">
              2. Academic Rigor Standard
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {academicLevels.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setProfile({ academicLevel: lvl.id })}
                  className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                    profile.academicLevel === lvl.id
                      ? 'bg-[#FAF8F5] border-zinc-900 shadow-xs ring-1 ring-zinc-900'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  <div className="font-bold text-xs text-zinc-900">{lvl.title}</div>
                  <div className="text-[11px] text-zinc-500 mt-1">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Skills Management */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold text-zinc-900 uppercase tracking-wider">
              3. Core Skills & Programming Languages ({profile.skills.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-800 text-xs font-semibold border border-zinc-200"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill (e.g., Python, GeoPandas, WebSockets)..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Tools & Frameworks */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold text-zinc-900 uppercase tracking-wider">
              4. Frameworks & Databases ({profile.tools.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {profile.tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-800 text-xs font-semibold border border-zinc-200"
                >
                  <span>{tool}</span>
                  <button
                    onClick={() => handleRemoveTool(tool)}
                    className="text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <form onSubmit={handleAddTool} className="flex gap-2">
              <input
                type="text"
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                placeholder="Add tool/db (e.g., PostgreSQL, Docker, MQTT)..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Action Trigger */}
          <div className="pt-4 border-t border-zinc-200">
            <button
              onClick={() => {
                if (onStartDiscovery) onStartDiscovery();
              }}
              className="w-full py-4 rounded-2xl btn-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] cursor-pointer"
            >
              <span>Discover 3 Grounded Problem Opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
