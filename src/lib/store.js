import { create } from 'zustand';

const defaultProfile = {
  academicLevel: 'UG',
  domain: '',
  skills: [],
  tools: [],
  interests: '',
  timeline: '3 Months (Final Semester)',
  teamSize: 'Solo (Individual Project)',
  constraints: '',
  resumeText: ''
};

const defaultMentorProjectContext = {
  problem: "",
  solution: "",
  builtSoFar: "",
  plan: "",
  academicLevel: "UG",
  department: "",
  focusAreas: []
};

export const useAppStore = create((set, get) => ({
  // Active Navigation Tab across the entire unified platform
  // 'discovery' | 'health' | 'viva' | 'docs' | 'roadmap' | 'chat'
  activeTab: 'discovery',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // User Profile
  profile: defaultProfile,
  setProfile: (updates) => set((state) => ({ profile: { ...state.profile, ...updates } })),

  // Discovery State
  discoveryStatus: 'idle', // 'idle' | 'analyzing' | 'researching' | 'filtering' | 'scoring' | 'synthesizing' | 'completed' | 'error'
  researchLogs: [],
  addResearchLog: (step, detail, type = 'info') => set((state) => ({
    researchLogs: [...state.researchLogs, { id: Date.now() + Math.random(), step, detail, type, time: new Date().toLocaleTimeString() }]
  })),
  clearResearchLogs: () => set({ researchLogs: [] }),
  setDiscoveryStatus: (status) => set({ discoveryStatus: status }),

  // Discovered Opportunities
  opportunities: [],
  setOpportunities: (opportunities) => set({ opportunities }),

  // Active Opportunity Detail
  activeOpportunity: null,
  setActiveOpportunity: (opportunity) => set({ activeOpportunity: opportunity }),

  // Saved / Bookmarked Projects
  savedProjects: (() => {
    try {
      if (typeof localStorage !== 'undefined') {
        return JSON.parse(localStorage.getItem('project_scout_saved') || '[]');
      }
    } catch {}
    return [];
  })(),
  toggleSaveProject: (project) => {
    const saved = get().savedProjects;
    const exists = saved.some((p) => p.id === project.id);
    let updated;
    if (exists) {
      updated = saved.filter((p) => p.id !== project.id);
    } else {
      updated = [{ ...project, savedAt: new Date().toISOString() }, ...saved];
    }
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('project_scout_saved', JSON.stringify(updated));
      }
    } catch {}
    set({ savedProjects: updated });
  },

  // Project / Repo Context
  mentorProjectContext: defaultMentorProjectContext,
  setMentorProjectContext: (updates) => set((state) => ({
    mentorProjectContext: { ...state.mentorProjectContext, ...updates }
  })),

  // Connected GitHub Repository Data
  repoData: null,
  setRepoData: (data) => set({ repoData: data }),
  isRepoModalOpen: false,
  setRepoModalOpen: (isOpen) => set({ isRepoModalOpen: isOpen }),

  // Audit and Intelligence Results
  auditStatus: 'idle', // 'idle' | 'auditing' | 'completed' | 'error'
  setAuditStatus: (status) => set({ auditStatus: status }),
  auditResults: null,
  setAuditResults: (results) => set({ auditResults: results }),

  // Viva Suite
  vivaStatus: 'idle', // 'idle' | 'generating' | 'completed' | 'error'
  setVivaStatus: (status) => set({ vivaStatus: status }),
  vivaData: null,
  setVivaData: (data) => set({ vivaData: data }),

  // Documentation Audit
  docAuditStatus: 'idle', // 'idle' | 'auditing' | 'completed' | 'error'
  setDocAuditStatus: (status) => set({ docAuditStatus: status }),
  docAuditData: null,
  setDocAuditData: (data) => set({ docAuditData: data }),

  // Mentor Chat Messages
  mentorMessages: [
    {
      id: 'welcome-mentor',
      role: 'model',
      text: 'Welcome to Project Scout AI Mentor. I continuously inspect your repository structure, code implementation, and academic defense readiness. How can I assist your engineering roadmap or viva prep today?'
    }
  ],
  addMentorMessage: (message) => set((state) => ({
    mentorMessages: [...state.mentorMessages, { id: Date.now() + Math.random(), ...message }]
  })),
  clearMentorMessages: () => set({ mentorMessages: [] }),

  // 1-Click Bridge: Launch Discovered Opportunity directly into Repository Audit / Mentorship
  bridgeOpportunityToMentor: (opp) => {
    set({
      activeTab: 'health',
      mentorProjectContext: {
        problem: opp.problemStatement || opp.title,
        solution: opp.suggestedArchitecture?.pattern || opp.whyItMatters,
        builtSoFar: "Prototype / Initial codebase",
        plan: `Build ${opp.title} targeting ${opp.targetAudience || "academic capstone evaluation"}`,
        academicLevel: opp.academicTier || "UG",
        department: "Computer Science",
        focusAreas: ["Architecture", "Research", "Viva preparation", "Documentation"]
      },
      isRepoModalOpen: !get().repoData
    });
  },

  // Modals & Key
  isSavedDrawerOpen: false,
  setSavedDrawerOpen: (isOpen) => set({ isSavedDrawerOpen: isOpen }),
  isMentorOpen: false,
  setMentorOpen: (isOpen) => set({ isMentorOpen: isOpen }),
  apiKey: (() => {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('project_scout_api_key');
        if (stored) return stored;
      }
    } catch {}
    try {
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
      }
    } catch {}
    return '';
  })(),
  setApiKey: (key) => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('project_scout_api_key', key);
      }
    } catch {}
    set({ apiKey: key });
  }
}));
