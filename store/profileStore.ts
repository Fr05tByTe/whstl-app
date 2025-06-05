import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmergencyContact, UserProfile } from '@/types';

type ProfileState = {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  updateEmergencyContact: (id: string, contact: Partial<EmergencyContact>) => void;
  removeEmergencyContact: (id: string) => void;
  setTriggerPhrase: (phrase: string) => void;
  setSafePhrase: (phrase: string) => void;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,
      updateProfile: (profileData) => {
        const currentProfile = get().profile;
        set({ 
          profile: currentProfile ? { ...currentProfile, ...profileData } : profileData as UserProfile 
        });
      },
      addEmergencyContact: (contact) => {
        const currentProfile = get().profile;
        if (!currentProfile) return;
        
        const newContact = {
          ...contact,
          id: `contact-${Date.now()}`
        };
        
        set({
          profile: {
            ...currentProfile,
            emergencyContacts: [...currentProfile.emergencyContacts, newContact]
          }
        });
      },
      updateEmergencyContact: (id, contactData) => {
        const currentProfile = get().profile;
        if (!currentProfile) return;
        
        const updatedContacts = currentProfile.emergencyContacts.map(contact => 
          contact.id === id ? { ...contact, ...contactData } : contact
        );
        
        set({
          profile: {
            ...currentProfile,
            emergencyContacts: updatedContacts
          }
        });
      },
      removeEmergencyContact: (id) => {
        const currentProfile = get().profile;
        if (!currentProfile) return;
        
        set({
          profile: {
            ...currentProfile,
            emergencyContacts: currentProfile.emergencyContacts.filter(
              contact => contact.id !== id
            )
          }
        });
      },
      setTriggerPhrase: (phrase) => {
        const currentProfile = get().profile;
        if (!currentProfile) return;
        
        set({
          profile: {
            ...currentProfile,
            triggerPhrase: phrase
          }
        });
      },
      setSafePhrase: (phrase) => {
        const currentProfile = get().profile;
        if (!currentProfile) return;
        
        set({
          profile: {
            ...currentProfile,
            safePhrase: phrase
          }
        });
      }
    }),
    {
      name: 'whstl-profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);