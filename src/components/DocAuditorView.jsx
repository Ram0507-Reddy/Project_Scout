import React, { useState } from 'react';
import { useAppStore } from '../lib/store';
import { auditDocumentationGaps } from '../lib/mentorEngine';
import { 
  BookOpen, CheckCircle2, AlertTriangle, XCircle, 
  Sparkles, Copy, Check, Loader2, FileText 
} from 'lucide-react';

export const DocAuditorView = () => {
  const { 
    docAuditData, 
    setDocAuditData, 
    docAuditStatus, 
    setDocAuditStatus, 
    repoData, 
    mentorProjectContext,
    setRepoModalOpen
  } = useAppStore();

  const [activeDraft, setActiveDraft] = useState(null);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [manualReadme, setManualReadme] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);

  const handleAuditDocs = async (useManual = false) => {
    if (!useManual && !repoData) return;
    setDocAuditStatus('auditing');
    try {
      const targetRepoData = useManual ? { name: "Manual README Audit", readme: manualReadme } : repoData;
      const data = await auditDocumentationGaps(mentorProjectContext, targetRepoData);
      setDocAuditData(data);
      setDocAuditStatus('completed');
      if (useManual) setIsManualMode(true);
    } catch (err) {
      console.error('Doc audit failed:', err);
      setDocAuditStatus('error');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  if (!repoData && !isManualMode && docAuditStatus !== 'auditing') {
    return (
      <div className="p-10 rounded-3xl bg-white border border-zinc-200 text-center space-y-6 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-zinc-900">Doc Auditor</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Connect your GitHub repository to audit your README against academic capstone standards, or paste your README manually below.
          </p>
        </div>
        
        <div className="w-full max-w-xl space-y-4">
          <textarea
            value={manualReadme}
            onChange={(e) => setManualReadme(e.target.value)}
            placeholder="Paste your README.md content here..."
            className="w-full h-40 p-4 rounded-xl border border-zinc-300 text-xs font-mono bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleAuditDocs(true)}
              disabled={!manualReadme.trim()}
              className="px-6 py-3 rounded-xl btn-black text-xs font-bold w-full sm:w-auto shadow-md disabled:opacity-50 cursor-pointer"
            >
              Audit Manual README
            </button>
            <div className="text-xs font-bold text-zinc-400">OR</div>
            <button
              onClick={() => setRepoModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-white border border-zinc-200 text-zinc-800 text-xs font-bold hover:bg-zinc-50 w-full sm:w-auto shadow-sm cursor-pointer"
            >
              Connect Repository
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!docAuditData && docAuditStatus !== 'auditing') {
    return (
      <div className="p-10 rounded-3xl bg-white border border-zinc-200 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-[#2DD4BF]/20 border border-[#2DD4BF]/30 flex items-center justify-center text-zinc-900 mx-auto">
          <BookOpen className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-zinc-900">
          Academic Documentation & README Auditor
        </h3>
        <p className="text-xs text-zinc-500 max-w-lg mx-auto">
          A project without rigorous documentation will be penalized in the university project report. 
          Audit your README against the 10-point academic capstone standard and auto-generate missing sections.
        </p>
        <button
          onClick={() => handleAuditDocs(isManualMode)}
          disabled={!repoData && !isManualMode}
          className="px-6 py-3 rounded-2xl btn-black text-xs font-bold flex items-center gap-2 mx-auto shadow-md disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#2DD4BF]" />
          <span>Audit Documentation</span>
        </button>
      </div>
    );
  }

  if (docAuditStatus === 'auditing') {
    return (
      <div className="p-12 rounded-3xl bg-white border border-zinc-200 text-center space-y-4 shadow-sm">
        <Loader2 className="w-10 h-10 text-[#FF5A43] animate-spin mx-auto" />
        <h3 className="text-base font-bold text-zinc-900">
          Auditing Repository Documentation...
        </h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Comparing README.md against IEEE/ACM capstone report documentation requirements...
        </p>
      </div>
    );
  }

  const { documentationScore, checklist } = docAuditData || {};

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Score */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center font-black text-2xl ${
            documentationScore >= 80 ? 'text-emerald-700 border-emerald-300 bg-emerald-50' :
            documentationScore >= 50 ? 'text-amber-700 border-amber-300 bg-amber-50' :
            'text-rose-700 border-rose-300 bg-rose-50'
          }`}>
            {documentationScore || 65}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-zinc-900">Documentation Integrity Score</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-mono font-semibold">
                {repoData ? `${repoData.owner}/${repoData.name}` : 'Manual README'}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              {checklist?.filter(c => c.status === 'PASS').length || 0} / {checklist?.length || 10} academic standards met against live repository structure.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setRepoModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Change Repo
          </button>
          <button
            onClick={() => handleAuditDocs(isManualMode)}
            className="px-4 py-2 rounded-xl btn-black text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>Re-Audit Live README</span>
          </button>
        </div>
      </div>

      {/* 10-Point Checklist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {(checklist || []).map((item, idx) => (
          <div 
            key={idx}
            className="p-5 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 transition-all space-y-2 flex flex-col justify-between shadow-sm"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                  {item.status === 'PASS' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {item.status === 'WARNING' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                  {item.status === 'FAIL' && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                  {item.item}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  item.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' :
                  item.status === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {item.comment}
              </p>
            </div>

            {item.draftContent && (
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium">
                  Draft section available
                </span>
                <button
                  onClick={() => setActiveDraft(item)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3 h-3 text-[#2DD4BF]" />
                  <span>View Draft</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for viewing generated draft */}
      {activeDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-[#FF5A43]" />
                Auto-Generated Section: {activeDraft.item}
              </div>
              <button
                onClick={() => setActiveDraft(null)}
                className="text-zinc-500 hover:text-zinc-900 text-xs font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 font-mono text-xs text-zinc-800 bg-zinc-50 leading-relaxed">
              <pre className="whitespace-pre-wrap font-mono p-4 rounded-2xl bg-white border border-zinc-200 text-zinc-800">
                {activeDraft.draftContent}
              </pre>
            </div>

            <div className="p-5 border-t border-zinc-200 bg-[#FAF8F5] flex items-center justify-between">
              <span className="text-xs text-zinc-500">
                Paste this into your repository <code className="text-zinc-900 font-bold">README.md</code>
              </span>
              <button
                onClick={() => copyToClipboard(activeDraft.draftContent)}
                className="px-5 py-2.5 rounded-xl btn-black text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                {copiedDraft ? (
                  <>
                    <Check className="w-4 h-4 text-[#2DD4BF]" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Markdown
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
