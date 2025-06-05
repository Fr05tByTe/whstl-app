import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import Fonts from '@/constants/fonts';
import EmergencyButton from '@/components/EmergencyButton';
import Button from '@/components/Button';
import { useSafetyStore } from '@/store/safetyStore';
import { useProfileStore } from '@/store/profileStore';
import FakeCallModal from '@/components/FakeCallModal';
import CheckInTimerModal from '@/components/CheckInTimerModal';
import TimerCard from '@/components/TimerCard';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { 
    isEmergencyMode, 
    activeTimers, 
    createTimer, 
    cancelTimer, 
    triggerEmergency 
  } = useSafetyStore();
  const { profile } = useProfileStore();
  
  const [fakeCallVisible, setFakeCallVisible] = useState(false);
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(0));
  
  useEffect(() => {
    // Create a subtle background animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 15000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 15000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);
  
  const handleCreateTimer = (duration: number, message: string) => {
    createTimer(duration, message);
    setTimerModalVisible(false);
  };
  
  const handleCheckIn = (timerId: string) => {
    cancelTimer(timerId);
  };
  
  const backgroundTranslate = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0]
  });
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Animated.View 
        style={[
          styles.backgroundAnimation,
          {
            transform: [{ translateY: backgroundTranslate }]
          }
        ]}
      >
        <LinearGradient
          colors={[Colors.dark.primary + '10', 'transparent']}
          style={styles.backgroundGradient}
        />
      </Animated.View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello, {profile?.name || 'there'}
          </Text>
          <Text style={styles.subtitle}>
            Your personal safety companion
          </Text>
        </View>
        
        {activeTimers.length > 0 && (
          <View style={styles.timersSection}>
            <Text style={styles.sectionTitle}>Active Timers</Text>
            {activeTimers
              .filter(timer => timer.isActive)
              .map(timer => (
                <TimerCard
                  key={timer.id}
                  timer={timer}
                  onCancel={cancelTimer}
                  onCheckIn={handleCheckIn}
                />
              ))}
          </View>
        )}
        
        <View style={styles.emergencySection}>
          <EmergencyButton size="large" />
        </View>
        
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setFakeCallVisible(true)}
            >
              <LinearGradient
                colors={[Colors.dark.primary, Colors.dark.accent]}
                style={styles.actionIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="phone" size={24} color={Colors.dark.text} />
              </LinearGradient>
              <Text style={styles.actionText}>Fake Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setTimerModalVisible(true)}
            >
              <LinearGradient
                colors={[Colors.dark.primary, Colors.dark.accent]}
                style={styles.actionIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="timer-outline" size={24} color={Colors.dark.text} />
              </LinearGradient>
              <Text style={styles.actionText}>Check-In Timer</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Trigger Methods</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <MaterialCommunityIcons name="account-voice" size={20} color={Colors.dark.accent} />
              <Text style={styles.infoTitle}>Voice Trigger</Text>
            </View>
            <Text style={styles.infoText}>
              Say "{profile?.triggerPhrase || "help me"}" to activate emergency mode.
            </Text>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <MaterialCommunityIcons name="gesture-double-tap" size={20} color={Colors.dark.accent} />
              <Text style={styles.infoTitle}>Volume Button</Text>
            </View>
            <Text style={styles.infoText}>
              Press volume down button 3 times quickly to trigger emergency mode silently.
            </Text>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <MaterialCommunityIcons name="map-marker-outline" size={20} color={Colors.dark.accent} />
              <Text style={styles.infoTitle}>Location Sharing</Text>
            </View>
            <Text style={styles.infoText}>
              Your precise location is automatically shared with emergency contacts when triggered.
            </Text>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <MaterialCommunityIcons name="shield-lock-outline" size={20} color={Colors.dark.accent} />
              <Text style={styles.infoTitle}>Privacy Protection</Text>
            </View>
            <Text style={styles.infoText}>
              All your data is encrypted and only shared during emergencies with your trusted contacts.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <FakeCallModal 
        visible={fakeCallVisible}
        onClose={() => setFakeCallVisible(false)}
      />
      
      <CheckInTimerModal
        visible={timerModalVisible}
        onClose={() => setTimerModalVisible(false)}
        onCreateTimer={handleCreateTimer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  backgroundAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundGradient: {
    width: '200%',
    height: '200%',
    position: 'absolute',
    top: -100,
    left: -100,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: "700",
    color: Colors.dark.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Fonts.sizes.md,
    color: Colors.dark.textSecondary,
  },
  timersSection: {
    marginBottom: 24,
  },
  emergencySection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    elevation: 4,
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: Fonts.sizes.md,
    fontWeight: "500",
    color: Colors.dark.text,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 2,
    borderLeftColor: Colors.dark.accent,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: Fonts.sizes.md,
    fontWeight: "600",
    color: Colors.dark.text,
    marginLeft: 8,
  },
  infoText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
  },
});
