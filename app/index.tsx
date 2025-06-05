import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function Index() {
  const { isAuthenticated } = useAuthStore();
  
  // For development purposes, let's auto-authenticate to see the app
  useEffect(() => {
    if (!isAuthenticated) {
      // This simulates a login for development
      useAuthStore.getState().login("test@example.com", "password");
    }
  }, [isAuthenticated]);
  
  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}