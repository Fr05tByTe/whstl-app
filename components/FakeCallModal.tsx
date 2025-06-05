import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Vibration,
  Platform
} from 'react-native';
import Colors from '@/constants/colors';
import Fonts from '@/constants/fonts';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFakeCallStore } from '@/store/fakeCallStore';

type FakeCallModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function FakeCallModal({
  visible,
  onClose,
}: FakeCallModalProps) {
  const { callerName, callerImage, ringtone } = useFakeCallStore();
  const [callStatus, setCallStatus] = useState<'incoming' | 'active' | 'ended'>('incoming');
  const [callDuration, setCallDuration] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (visible && callStatus === 'incoming') {
      // Vibrate phone for incoming call
      if (Platform.OS !== 'web') {
        const pattern = [1000, 2000, 1000];
        Vibration.vibrate(pattern, true);
      }
    } else {
      if (Platform.OS !== 'web') {
        Vibration.cancel();
      }
    }
    
    if (callStatus === 'active') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
      if (Platform.OS !== 'web') {
        Vibration.cancel();
      }
    };
  }, [visible, callStatus]);
  
  const handleAnswer = () => {
    if (Platform.OS !== 'web') {
      Vibration.cancel();
    }
    setCallStatus('active');
  };
  
  const handleDecline = () => {
    if (Platform.OS !== 'web') {
      Vibration.cancel();
    }
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
      setCallStatus('incoming');
      setCallDuration(0);
    }, 1000);
  };
  
  const formatCallDuration = () => {
    const minutes = Math.floor(callDuration / 60);
    const seconds = callDuration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleDecline}
    >
      <LinearGradient
        colors={['#0A2463', '#1E3A8A']}
        style={styles.container}
      >
        <View style={styles.callerInfo}>
          <View style={styles.avatarContainer}>
            {callerImage ? (
              <Image source={{ uri: callerImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <FontAwesome name="user" size={40} color={Colors.dark.text} />
              </View>
            )}
          </View>
          
          <Text style={styles.callerName}>{callerName}</Text>
          
          <Text style={styles.callStatus}>
            {callStatus === 'incoming' 
              ? 'Incoming call...' 
              : callStatus === 'active' 
                ? formatCallDuration()
                : 'Call ended'}
          </Text>
        </View>
        
        <View style={styles.actionsContainer}>
          {callStatus === 'incoming' ? (
            <>
              <TouchableOpacity 
                style={[styles.actionButton, styles.declineButton]}
                onPress={handleDecline}
              >
                <MaterialCommunityIcons name="phone-hangup" size={28} color={Colors.dark.text} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.answerButton]}
                onPress={handleAnswer}
              >
                <MaterialCommunityIcons name="phone" size={28} color={Colors.dark.text} />
              </TouchableOpacity>
            </>
          ) : callStatus === 'active' ? (
            <TouchableOpacity 
              style={[styles.actionButton, styles.declineButton]}
              onPress={handleDecline}
            >
               <MaterialCommunityIcons name="phone-hangup" size={28} color={Colors.dark.text} />
            </TouchableOpacity>
          ) : null}
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  callerInfo: {
    alignItems: 'center',
    marginTop: 80,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.dark.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.primary,
  },
  callerName: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: 700,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  callStatus: {
    fontSize: Fonts.sizes.md,
    color: Colors.dark.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerButton: {
    backgroundColor: Colors.dark.success,
  },
  declineButton: {
    backgroundColor: Colors.dark.danger,
  },
});