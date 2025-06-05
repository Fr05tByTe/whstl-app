import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { CheckInTimer } from '@/types';
import Colors from '@/constants/colors';
import Fonts from '@/constants/fonts';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type TimerCardProps = {
  timer: CheckInTimer;
  onCancel: (id: string) => void;
  onCheckIn: (id: string) => void;
};

export default function TimerCard({
  timer,
  onCancel,
  onCheckIn
}: TimerCardProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [progress] = useState(new Animated.Value(0));
  
  useEffect(() => {
    if (!timer.isActive) return;
    
    const endTime = timer.startTime + timer.duration * 60 * 1000;
    const totalDuration = timer.duration * 60 * 1000;
    const remaining = Math.max(0, endTime - Date.now());
    const elapsed = totalDuration - remaining;
    const progressValue = Math.min(1, elapsed / totalDuration);
    
    setTimeLeft(remaining);
    progress.setValue(progressValue);
    
    const interval = setInterval(() => {
      const newRemaining = Math.max(0, endTime - Date.now());
      const newElapsed = totalDuration - newRemaining;
      const newProgressValue = Math.min(1, newElapsed / totalDuration);
      
      setTimeLeft(newRemaining);
      progress.setValue(newProgressValue);
      
      if (newRemaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timer]);
  
  const formatTimeLeft = () => {
    if (timeLeft <= 0) return "Time's up!";
    
    const minutes = Math.floor(timeLeft / (60 * 1000));
    const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });
  
  const progressColor = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [Colors.dark.success, Colors.dark.warning, Colors.dark.danger]
  });
  
  if (!timer.isActive) return null;
  
  const isExpired = timeLeft <= 0;
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isExpired ? 
          [Colors.dark.danger + '20', Colors.dark.card] : 
          [Colors.dark.primary + '20', Colors.dark.card]
        }
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.timerInfo}>
            <Feather name="clock" size={20} color={isExpired ? Colors.dark.danger : Colors.dark.accent} />
            <Text style={[
              styles.timerText,
              isExpired && styles.expiredText
            ]}>
              {formatTimeLeft()}
            </Text>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onCheckIn(timer.id)}
            >
              <Feather name="check-circle" size={24} color={Colors.dark.success} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onCancel(timer.id)}
            >
              <Feather name="x-circle" size={24} color={Colors.dark.danger} />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.message}>{timer.message}</Text>
        
        <View style={styles.progressContainer}>
          <Animated.View 
            style={[
              styles.progressBar, 
              { 
                width: progressWidth,
                backgroundColor: progressColor
              }
            ]} 
          />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 700,
    color: Colors.dark.text,
    marginLeft: 8,
  },
  expiredText: {
    color: Colors.dark.danger,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 12,
  },
  message: {
    fontSize: Fonts.sizes.md,
    color: Colors.dark.textSecondary,
    marginBottom: 12,
  },
  progressContainer: {
    height: 4,
    backgroundColor: Colors.dark.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
});