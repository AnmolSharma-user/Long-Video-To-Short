import { create } from "zustand";
import { VideoProject, VideoClip } from "../firebase";

interface UserState {
  credits: number;
  setCredits: (credits: number) => void;
  deductCredits: (amount: number) => void;
  addCredits: (amount: number) => void;
}

interface VideoState {
  currentProject: VideoProject | null;
  projects: VideoProject[];
  clips: VideoClip[];
  isProcessing: boolean;
  selectedDuration: number;
  setCurrentProject: (project: VideoProject | null) => void;
  setProjects: (projects: VideoProject[]) => void;
  setClips: (clips: VideoClip[]) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setSelectedDuration: (duration: number) => void;
  addProject: (project: VideoProject) => void;
  addClip: (clip: VideoClip) => void;
}

interface UIState {
  isUploadModalOpen: boolean;
  isProcessingModalOpen: boolean;
  isPaymentModalOpen: boolean;
  currentToast: { message: string; type: "success" | "error" | "info" } | null;
  setUploadModalOpen: (isOpen: boolean) => void;
  setProcessingModalOpen: (isOpen: boolean) => void;
  setPaymentModalOpen: (isOpen: boolean) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  clearToast: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  credits: 0,
  setCredits: (credits) => set({ credits }),
  deductCredits: (amount) => set((state) => ({ credits: state.credits - amount })),
  addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
}));

export const useVideoStore = create<VideoState>((set) => ({
  currentProject: null,
  projects: [],
  clips: [],
  isProcessing: false,
  selectedDuration: 1, // Default to 1-minute clips
  setCurrentProject: (project) => set({ currentProject: project }),
  setProjects: (projects) => set({ projects }),
  setClips: (clips) => set({ clips }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setSelectedDuration: (duration) => set({ selectedDuration: duration }),
  addProject: (project) => set((state) => ({ 
    projects: [...state.projects, project],
    currentProject: project 
  })),
  addClip: (clip) => set((state) => ({ 
    clips: [...state.clips, clip] 
  })),
}));

export const useUIStore = create<UIState>((set) => ({
  isUploadModalOpen: false,
  isProcessingModalOpen: false,
  isPaymentModalOpen: false,
  currentToast: null,
  setUploadModalOpen: (isOpen) => set({ isUploadModalOpen: isOpen }),
  setProcessingModalOpen: (isOpen) => set({ isProcessingModalOpen: isOpen }),
  setPaymentModalOpen: (isOpen) => set({ isPaymentModalOpen: isOpen }),
  showToast: (message, type) => set({ currentToast: { message, type } }),
  clearToast: () => set({ currentToast: null }),
}));