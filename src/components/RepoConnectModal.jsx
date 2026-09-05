import React, { useState } from 'react';
import { useAppStore } from '../lib/store';
import { fetchGithubRepoData, parseGithubUrl, SAMPLE_REPOS } from '../lib/github';
import { auditProjectHealth } from '../lib/mentorEngine';
import { FolderGit2, Sparkles, AlertCircle, Loader2, X, ArrowRight, BookOpen } from 'lucide-react';

export const RepoConnectModal = () => {
  const { 
    isRepoModalOpen, 
    setRepoModalOpen, 
    setRepoData, 
    mentorProjectContext, 
    setAuditStatus, 
    setAuditResults 
  } = useAppStore();

  const [repoUrl, setRepoUrl] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeGuideTab, setActiveGuideTab] = useState('connect'); // 'connect' | 'no-repo-guide'

  if (!isRepoModalOpen) return null;

  const handleConnect = async (urlToFetch = repoUrl, isSample = false) => {
    setError(null);
    setIsLoading(true);

    try {
      let parsed = await parseGithubUrl(urlToFetch);
      if (!parsed) {
        throw new Error('Please enter a valid GitHub repository URL (e.g. https://github.com/owner/repo)');
      }

      const data = await fetchGithubRepoData(parsed.owner, parsed.repo, githubToken);
      setRepoData(data);
      setRepoModalOpen(false);

      // Auto-trigger health audit
      setAuditStatus('auditing');
      try {
        const audit = await auditProjectHealth(mentorProjectContext, data);
        setAuditResults(audit);
        setAuditStatus('completed');
      } catch (err) {
        console.error("Auto audit error:", err);
        setAuditStatus('error');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect repository.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample) => {
    handleConnect(sample.url, true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-[#2DD4BF]">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                Connect GitHub Repository
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF5A43]/10 text-[#FF5A43] font-bold">
                  Source of Truth
                </span>
              </h2>
              <p className="text-xs text-zinc-500">
                Grant the AI mentor visibility into your code, structure, and README
              </p>
            </div>
          </div>
          <button 
            onClick={() => setRepoModalOpen(false)}
            className="p-2 text-zinc-400 hover:text-zinc-900 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-zinc-200 bg-white px-6 pt-2">
          <button
            onClick={() => setActiveGuideTab('connect')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeGuideTab === 'connect'
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-700'
            }`}
          >
            Connect Repository
          </button>
          <button
            onClick={() => setActiveGuideTab('no-repo-guide')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeGuideTab === 'no-repo-guide'
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-700'
            }`}
          >
            Don't have a GitHub Repo yet?
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {activeGuideTab === 'connect' ? (
            <>
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Repo URL Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-800">
                  GitHub Repository URL <span className="text-[#FF5A43]">*</span>
                </label>
                <input
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/my-capstone-project"
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRepoModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConnect()}
                  disabled={isLoading || !repoUrl.trim()}
                  className="px-6 py-3 rounded-2xl btn-black text-xs font-bold flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#2DD4BF]" />
                      Analyzing Repo...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#2DD4BF]" />
                      Connect & Audit Project
                    </>
                  )}
                </button>
              </div>

            </>
          ) : (
            /* 2-Minute Onboarding for students without a repo */
            <div className="space-y-4 text-xs text-zinc-700">
              <div className="p-4 rounded-2xl bg-[#FF5A43]/10 border border-[#FF5A43]/20 text-zinc-900">
                <h3 className="font-bold text-sm mb-1 text-zinc-900">
                  Zero to GitHub in ~2 Minutes
                </h3>
                <p className="text-zinc-600">
                  Follow these 4 simple steps to initialize your capstone project repository.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="font-bold text-zinc-900 mb-1">Step 1: Sign In to GitHub</div>
                  <p className="text-zinc-500">Sign in or create an account at GitHub.com.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="font-bold text-zinc-900 mb-1">Step 2: Create a New Repository</div>
                  <p className="text-zinc-500">Name your repo and set it to <strong>Public</strong>.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="font-bold text-zinc-900 mb-1">Step 3: Push Your Code</div>
                  <p className="text-zinc-500">Push your initial files or drag your project folder in.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="font-bold text-zinc-900 mb-1">Step 4: Paste Repo Link Above</div>
                  <p className="text-zinc-500">Switch back to "Connect Repository" and paste your link!</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveGuideTab('connect')}
                  className="w-full py-3 rounded-2xl btn-black text-xs font-bold text-center cursor-pointer"
                >
                  I'm Ready - Connect Repository
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
