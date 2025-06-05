import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FakeCallState = {
  callerName: string;
  callerImage: string | null;
  ringtone: string | null;
  updateCallerName: (name: string) => void;
  updateCallerImage: (imageUri: string | null) => void;
  updateRingtone: (ringtoneUri: string | null) => void;
};

export const useFakeCallStore = create<FakeCallState>()(
  persist(
    (set) => ({
      callerName: 'Mom',
      callerImage: null,
      ringtone: null,
      
      updateCallerName: (name) => {
        set({ callerName: name });
      },
      
      updateCallerImage: (imageUri) => {
        set({ callerImage: imageUri });
      },
      
      updateRingtone: (ringtoneUri) => {
        set({ ringtone: ringtoneUri });
      }
    }),
    {
      name: 'whstl-fakecall-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);