import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthState = {
  isAuthenticated: boolean;
  userId: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

// This is a mock implementation since we don't have a real backend
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userId: null,
      isLoading: false,
      error: null,
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, this would validate credentials with a backend
          if (email && password) {
            set({ 
              isAuthenticated: true, 
              userId: 'user-123', 
              isLoading: false 
            });
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Login failed" 
          });
        }
      },
      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, this would register the user with a backend
          if (email && password && name) {
            set({ 
              isAuthenticated: true, 
              userId: 'user-123', 
              isLoading: false 
            });
          } else {
            throw new Error("Invalid registration data");
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Registration failed" 
          });
        }
      },
      logout: () => {
        set({ 
          isAuthenticated: false, 
          userId: null 
        });
      }
    }),
    {
      name: 'whstl-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);