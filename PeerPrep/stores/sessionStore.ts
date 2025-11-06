/**
 * Session Store
 * 
 * Manages active session state
 */

import { create } from 'zustand';
import { Session } from '../lib/types';

interface SessionState {
  currentSession: Session | null;
  sessionNotes: string;
  timerSeconds: number;
  isTimerRunning: boolean;
  
  // Actions
  setCurrentSession: (session: Session | null) => void;
  updateNotes: (notes: string) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  currentSession: null,
  sessionNotes: '',
  timerSeconds: 25 * 60, // 25 minutes in seconds
  isTimerRunning: false,

  setCurrentSession: (session) => set({ currentSession: session }),
  
  updateNotes: (notes) => set({ sessionNotes: notes }),
  
  startTimer: () => set({ isTimerRunning: true }),
  
  pauseTimer: () => set({ isTimerRunning: false }),
  
  resetTimer: () => set({ timerSeconds: 25 * 60, isTimerRunning: false }),
  
  tickTimer: () =>
    set((state) => ({
      timerSeconds: state.isTimerRunning && state.timerSeconds > 0
        ? state.timerSeconds - 1
        : state.timerSeconds,
    })),
}));


