import { create } from 'zustand';

const defaultProfile = {
  academicLevel: 'UG', // 'UG' | 'PG' | 'PhD'
  domain: 'Computer Science & AI/ML',
  skills: ['Python', 'Machine Learning', 'API Development', 'React'],
  tools: ['FastAPI', 'PyTorch', 'TailwindCSS', 'Git'],
  interests: 'Real-time safety, automated security, and accessible healthcare solutions',
  timeline: '3 Months (Final Semester)',
  teamSize: 'Solo (Individual Project)',
  constraints: 'Free tier cloud deployment, zero hardware cost',
  resumeText: ''
};

export const useAppStore = create((set, get) => ({
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

  // AI Mentor Chat
  isMentorOpen: false,
  setMentorOpen: (isOpen) => set({ isMentorOpen: isOpen }),
  mentorMessages: [],
  addMentorMessage: (message) => set((state) => ({
    mentorMessages: [...state.mentorMessages, message]
  })),
  clearMentorMessages: () => set({ mentorMessages: [] }),

  // Saved / Bookmarked Projects
  savedProjects: JSON.parse(localStorage.getItem('project_scout_saved') || '[]'),
  toggleSaveProject: (project) => {
    const saved = get().savedProjects;
    const exists = saved.some((p) => p.id === project.id);
    let updated;
    if (exists) {
      updated = saved.filter((p) => p.id !== project.id);
    } else {
      updated = [{ ...project, savedAt: new Date().toISOString() }, ...saved];
    }
    localStorage.setItem('project_scout_saved', JSON.stringify(updated));
    set({ savedProjects: updated });
  },

  // Drawers / Modals
  isSavedDrawerOpen: false,
  setSavedDrawerOpen: (isOpen) => set({ isSavedDrawerOpen: isOpen }),
  apiKey: localStorage.getItem('project_scout_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '',
  setApiKey: (key) => {
    localStorage.setItem('project_scout_api_key', key);
    set({ apiKey: key });
  }
}));
