export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
};

export type UserProfile = {
  id: string;
  name: string;
  phone: string;
  email: string;
  emergencyContacts: EmergencyContact[];
  safePhrase: string;
  triggerPhrase: string;
  profileImage?: string;
};

export type CheckInTimer = {
  id: string;
  duration: number; // in minutes
  startTime: number; // timestamp
  isActive: boolean;
  message: string;
};

export type EmergencyAlert = {
  id: string;
  timestamp: number;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  type: 'voice' | 'button' | 'timer' | 'manual';
  recordingUrl?: string;
  sentTo: string[]; // contact IDs
  status: 'sending' | 'sent' | 'failed';
};