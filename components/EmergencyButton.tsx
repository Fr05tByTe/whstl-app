import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View,
  Animated,
  Easing
} from 'react-native';
import { useSafetyStore } from '@/store/safetyStore';
import Colors from '@/constants/colors';
import Fonts from '@/constants/fonts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type EmergencyButtonProps = {
  size?: 'medium' | 'large';
};

export default function EmergencyButton({ size = 'large' }: EmergencyButtonProps) {
  const { isEmergencyMode, triggerEmergency, cancelEmergency } = useSafetyStore();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation;
    let rotateAnimation: Animated.CompositeAnimation;
    
    if (isEmergencyMode) {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          })
        ])
      );
      
      rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      
      pulseAnimation.start();
      rotateAnimation.start();
    } else {
      pulseAnim.setValue(1);
      rotateAnim.setValue(0);
    }
    
    return () => {
      if (pulseAnimation) {
        pulseAnimation.stop();
      }
      if (rotateAnimation) {
        rotateAnimation.stop();
      }
    };
  }, [isEmergencyMode, pulseAnim, rotateAnim]);
  
  const handlePress = () => {
    if (isEmergencyMode) {
      cancelEmergency();
    } else {
      triggerEmergency('manual');
    }
  };
  
  const buttonSize = size === 'large' ? 120 : 80;
  
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pulseContainer,
          {
            width: buttonSize + 20,
            height: buttonSize + 20,
            borderRadius: (buttonSize + 20) / 2,
            transform: [
              { scale: pulseAnim },
              { rotate: isEmergencyMode ? spin : '0deg' }
            ],
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            {
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
            }
          ]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isEmergencyMode ? 
              [Colors.dark.danger, '#FF7B8B'] : 
              [Colors.dark.primary, Colors.dark.accent]
            }
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.content}>
              <MaterialCommunityIcons 
                name="alert-circle-outline"
                size={size === 'large' ? 32 : 24}
                color={Colors.dark.text}
              />
              <Text style={styles.text}>
                {isEmergencyMode ? 'CANCEL' : 'SOS'}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.helpText}>
        {isEmergencyMode 
          ? "Emergency mode active. Tap to cancel." 
          : "Tap to trigger emergency alert"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  pulseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 71, 87, 0.2)',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.dark.text,
    fontSize: Fonts.sizes.md,
    fontWeight: 700,
    marginTop: 4,
  },
  helpText: {
    color: Colors.dark.textSecondary,
    fontSize: Fonts.sizes.sm,
    marginTop: 12,
    textAlign: 'center',
  }
});