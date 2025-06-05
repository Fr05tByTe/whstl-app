import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import Colors from '@/constants/colors';
import Fonts from '@/constants/fonts';
import Button from './Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type CheckInTimerModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreateTimer: (duration: number, message: string) => void;
};

const PRESET_DURATIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
];

const DEFAULT_MESSAGE = "I haven't checked in. Please contact me.";

export default function CheckInTimerModal({
  visible,
  onClose,
  onCreateTimer
}: CheckInTimerModalProps) {
  const [duration, setDuration] = useState<number>(30);
  const [customDuration, setCustomDuration] = useState<string>('');
  const [message, setMessage] = useState<string>(DEFAULT_MESSAGE);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  
  const handleCreate = () => {
    const finalDuration = isCustom ? parseInt(customDuration, 10) : duration;
    if (finalDuration > 0) {
      onCreateTimer(finalDuration, message);
      resetAndClose();
    }
  };
  
  const resetAndClose = () => {
    setDuration(30);
    setCustomDuration('');
    setMessage(DEFAULT_MESSAGE);
    setIsCustom(false);
    onClose();
  };
  
  const selectPresetDuration = (value: number) => {
    setDuration(value);
    setIsCustom(false);
  };
  
  const enableCustomDuration = () => {
    setIsCustom(true);
    setCustomDuration(duration.toString());
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={resetAndClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Set Check-In Timer</Text>
              <TouchableOpacity onPress={resetAndClose} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color={Colors.dark.textSecondary} />
              </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.scrollContent}>
            <Text style={styles.sectionTitle}>
              <MaterialCommunityIcons name="clock-outline" size={18} color={Colors.dark.accent} />
            </Text>
            
            <View style={styles.durationOptions}>
              {PRESET_DURATIONS.map((preset) => (
                <TouchableOpacity
                  key={preset.value}
                  style={[
                    styles.durationOption,
                    duration === preset.value && !isCustom && styles.selectedDuration
                  ]}
                  onPress={() => selectPresetDuration(preset.value)}
                >
                  <Text 
                    style={[
                      styles.durationText,
                      duration === preset.value && !isCustom && styles.selectedDurationText
                    ]}
                  >
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={[
                  styles.durationOption,
                  isCustom && styles.selectedDuration
                ]}
                onPress={enableCustomDuration}
              >
                <Text 
                  style={[
                    styles.durationText,
                    isCustom && styles.selectedDurationText
                  ]}
                >
                  Custom
                </Text>
              </TouchableOpacity>
            </View>
            
            {isCustom && (
              <View style={styles.customDurationContainer}>
                <TextInput
                  style={styles.customDurationInput}
                  value={customDuration}
                  onChangeText={setCustomDuration}
                  keyboardType="number-pad"
                  placeholder="Enter minutes"
                  placeholderTextColor={Colors.dark.textSecondary}
                />
              </View>
            )}
            
            <Text style={styles.sectionTitle}>
              <MaterialCommunityIcons name="message-text-outline" size={18} color={Colors.dark.accent} /> Emergency Message
            </Text>
            
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Message to send if you don't check in"
              placeholderTextColor={Colors.dark.textSecondary}
              multiline
              numberOfLines={3}
            />
            
            <Text style={styles.helpText}>
              This message will be sent to your emergency contacts if you don't check in before the timer expires.
            </Text>
          </ScrollView>
          
          <View style={styles.footer}>
            <Button
              title="Cancel"
              onPress={resetAndClose}
              variant="outline"
              style={styles.footerButton}
            />
            <Button
              title="Start Timer"
              onPress={handleCreate}
              variant="primary"
              style={styles.footerButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 700,
    color: Colors.dark.text,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    maxHeight: '70%',
  },
  sectionTitle: {
    fontSize: Fonts.sizes.md,
    fontWeight: 600,
    color: Colors.dark.text,
    marginBottom: 12,
    marginTop: 16,
  },
  durationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  durationOption: {
    backgroundColor: Colors.dark.card,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedDuration: {
    backgroundColor: Colors.dark.accent,
  },
  durationText: {
    color: Colors.dark.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontWeight: 500,
  },
  selectedDurationText: {
    color: Colors.dark.text,
  },
  customDurationContainer: {
    marginBottom: 16,
  },
  customDurationInput: {
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.text,
    fontSize: Fonts.sizes.md,
  },
  messageInput: {
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.text,
    fontSize: Fonts.sizes.md,
    textAlignVertical: 'top',
    minHeight: 80,
    marginBottom: 8,
  },
  helpText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.dark.textSecondary,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});