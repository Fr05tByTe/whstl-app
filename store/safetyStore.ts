import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckInTimer, EmergencyAlert } from '@/types';

type SafetyState = {
  isEmergencyMode: boolean;
  isRecording: boolean;
  activeTimers: CheckInTimer[];
  recentAlerts: EmergencyAlert[];
  triggerEmergency: (type: 'voice' | 'button' | 'timer' | 'manual') => void;
  cancelEmergency: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  createTimer: (duration: number, message: string) => void;
  cancelTimer: (id: string) => void;
  addAlert: (alert: EmergencyAlert) => void;
};

export const useSafetyStore = create<SafetyState>()(
  persist(
    (set, get) => ({
      isEmergencyMode: false,
      isRecording: false,
      activeTimers: [],
      recentAlerts: [],
      
      triggerEmergency: (type) => {
        set({ isEmergencyMode: true });
        
        // Create a new alert
        const newAlert: EmergencyAlert = {
          id: `alert-${Date.now()}`,
          timestamp: Date.now(),
          type,
          sentTo: [],
          status: 'sending'
        };
        
        // Add to recent alerts
        const { recentAlerts } = get();
        set({ recentAlerts: [newAlert, ...recentAlerts].slice(0, 10) });
        
        // Start recording
        get().startRecording();
      },
      
      cancelEmergency: () => {
        set({ isEmergencyMode: false });
        get().stopRecording();
      },
      
      startRecording: () => {
        set({ isRecording: true });
      },
      
      stopRecording: () => {
        set({ isRecording: false });
      },
      
      createTimer: (duration, message) => {
        const newTimer: CheckInTimer = {
          id: `timer-${Date.now()}`,
          duration,
          startTime: Date.now(),
          isActive: true,
          message
        };
        
        const { activeTimers } = get();
        set({ activeTimers: [...activeTimers, newTimer] });
      },
      
      cancelTimer: (id) => {
        const { activeTimers } = get();
        set({ 
          activeTimers: activeTimers.map(timer => 
            timer.id === id ? { ...timer, isActive: false } : timer
          )
        });
      },
      
      addAlert: (alert) => {
        const { recentAlerts } = get();
        set({ recentAlerts: [alert, ...recentAlerts].slice(0, 10) });
      }
    }),
    {
      name: 'whstl-safety-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);