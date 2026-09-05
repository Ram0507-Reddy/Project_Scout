import React from 'react';
import { useAppStore } from '../lib/store';
import { ProjectHealthView } from './ProjectHealthView';
import { VivaDefenseView } from './VivaDefenseView';
import { DocAuditorView } from './DocAuditorView';
import { RoadmapNextStepsView } from './RoadmapNextStepsView';
import { MentorChatConsole } from './MentorChatConsole';
import { RepoConnectModal } from './RepoConnectModal';
import { 
  Activity, GraduationCap, BookOpen, Rocket, 
  MessageSquareCode, FolderGit2, RefreshCw, CheckCircle2 
} from 'lucide-react';

export const MentorWorkspace = () => {
  const { 
    mentorSubTab, 
    setMentorSubTab, 
    repoData, 
    setRepoModalOpen, 
    mentorProjectContext
  } = useAppStore();

  const subTabs = [
    { id: 'health', label: 'Project Health Check', icon: Activity },
    { id: 'viva', label: 'Viva Defense Simulator', icon: GraduationCap },
    { id: 'docs', label: 'Documentation Auditor', icon: BookOpen },
    { id: 'roadmap', label: 'What Should I Do Next?', icon: Rocket },
    { id: 'chat', label: 'Mentor Chat', icon: MessageSquareCode }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      <RepoConnectModal />

      {/* Phase 2 Header & Connected Repository Banner */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FF5A43]/10 text-[#FF5A43] font-bold uppercase tracking-wider">
              Phase 2: Project Supervisor & Intelligence Engine
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs text-zinc-500 font-mono">
              Academic Tier: {mentorProjectContext.academicLevel || 'UG'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
            {mentorProjectContext.problem || 'Capstone Project Workspace'}
          </h1>
          <p className="text-xs text-zinc-500 max-w-2xl line-clamp-1">
            <strong>Plan:</strong> {mentorProjectContext.plan || 'Continuous audit and viva preparation'}
          </p>
        </div>

        {/* Repo Connection Status Widget */}
        <div className="flex items-center gap-3 shrink-0">
          {repoData ? (
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center gap-3">
              <FolderGit2 className="w-5 h-5 text-zinc-800" />
              <div>
                <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  {repoData.owner}/{repoData.name}
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  {repoData.fileTree?.length || 0} files indexed • {repoData.isSample ? 'Demo Repo' : 'Live GitHub'}
                </div>
              </div>
              <button
                onClick={() => setRepoModalOpen(true)}
                className="p-1.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 text-xs transition-colors ml-2 cursor-pointer"
                title="Switch Repository"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setRepoModalOpen(true)}
              className="px-5 py-3 rounded-2xl btn-black text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
            >
              <FolderGit2 className="w-4 h-4 text-[#2DD4BF]" />
              <span>Connect GitHub Repository</span>
            </button>
          )}
        </div>
      </div>

      {/* Phase 2 Sub-Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 overflow-x-auto no-scrollbar">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = mentorSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setMentorSubTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border border-zinc-200'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Sub-Tab View */}
      <div className="min-h-[500px]">
        {mentorSubTab === 'health' && <ProjectHealthView />}
        {mentorSubTab === 'viva' && <VivaDefenseView />}
        {mentorSubTab === 'docs' && <DocAuditorView />}
        {mentorSubTab === 'roadmap' && <RoadmapNextStepsView />}
        {mentorSubTab === 'chat' && <MentorChatConsole />}
      </div>

    </div>
  );
};
