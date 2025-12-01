/**
 * Session Store
 *
 * Manages active session state with real-time collaboration
 */

import { create } from "zustand";
import { Session } from "../lib/types";
import { ChatMessage } from "../lib/api/realtime";

interface SessionState {
  currentSession: Session | null;
  sessionNotes: string;
  sessionCode: string;
  chatMessages: ChatMessage[];
  timerSeconds: number;
  isTimerRunning: boolean;

  // Actions
  setCurrentSession: (session: Session | null) => void;
  updateNotes: (notes: string) => void;
  updateCode: (code: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  currentSession: null,
  sessionNotes: "",
  sessionCode:
    "// Write your solution here\n\nfunction twoSum(nums, target) {\n    \n}",
  chatMessages: [],
  timerSeconds: 25 * 60, // 25 minutes in seconds
  isTimerRunning: false,

  setCurrentSession: (session) => set({ currentSession: session }),

  updateNotes: (notes) => set({ sessionNotes: notes }),

  updateCode: (code) => set({ sessionCode: code }),

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),

  setChatMessages: (messages) => set({ chatMessages: messages }),

  startTimer: () => set({ isTimerRunning: true }),

  pauseTimer: () => set({ isTimerRunning: false }),

  resetTimer: () => set({ timerSeconds: 25 * 60, isTimerRunning: false }),

  tickTimer: () =>
    set((state) => ({
      timerSeconds:
        state.isTimerRunning && state.timerSeconds > 0
          ? state.timerSeconds - 1
          : state.timerSeconds,
    })),

  resetSession: () =>
    set({
      currentSession: null,
      sessionNotes: "",
      sessionCode:
        "// Write your solution here\n\nfunction twoSum(nums, target) {\n    \n}",
      chatMessages: [],
      timerSeconds: 25 * 60,
      isTimerRunning: false,
    }),
}));
