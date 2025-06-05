import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import Fonts from '@/constants/fonts';
import Button from '@/components/Button';
import { useProfileStore } from '@/store/profileStore';
import { Feather } from '@expo/vector-icons'; // <-- UPDATED

export default function PhrasesScreen() {
  const router = useRouter();
  const { profile, setTriggerPhrase, setSafePhrase } = useProfileStore();
  
  const [triggerPhrase, setTriggerPhraseLocal] = useState('');
  const [safePhrase, setSafePhraseLocal] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [volumeEnabled, setVolumeEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  
  useEffect(() => {
    if (profile) {
      setTriggerPhraseLocal(profile.triggerPhrase || 'help me');
      setSafePhraseLocal(profile.safePhrase || 'I am safe');
    }
  }, [profile]);
  
  const handleSave = () => {
    setTriggerPhrase(triggerPhrase);
    setSafePhrase(safePhrase);
    router.back();
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Voice Trigger Phrases</Text>
          <Text style={styles.subtitle}>
            Customize the phrases that activate or cancel emergency mode
          </Text>
          
          <View style={styles.infoBox}>
            <Feather name="info" size={20} color={Colors.dark.accent} />
            <Text style={styles.infoText}>
              Your device will listen for these phrases when the app is running. Choose phrases that are easy for you to remember but unlikely to be said in normal conversation.
            </Text>
          </View>
          
          <View style={styles.toggleSection}>
            <View style={styles.toggleItem}>
              <View style={styles.toggleInfo}>
                <Feather name="mic" size={20} color={Colors.dark.accent} />
                <Text style={styles.toggleText}>Voice Detection</Text>
              </View>
              <Switch
                value={voiceEnabled}
                onValueChange={setVoiceEnabled}
                trackColor={{ false: Colors.dark.inactive, true: Colors.dark.accent }}
                thumbColor={Colors.dark.text}
              />
            </View>
            
            <View style={styles.toggleItem}>
              <View style={styles.toggleInfo}>
                <Feather name="volume-2" size={20} color={Colors.dark.accent} />
                <Text style={styles.toggleText}>Volume Button Trigger</Text>
              </View>
              <Switch
                value={volumeEnabled}
                onValueChange={setVolumeEnabled}
                trackColor={{ false: Colors.dark.inactive, true: Colors.dark.accent }}
                thumbColor={Colors.dark.text}
              />
            </View>
            
            <View style={styles.toggleItem}>
              <View style={styles.toggleInfo}>
                <Feather name="activity" size={20} color={Colors.dark.accent} />
                <Text style={styles.toggleText}>Vibration Feedback</Text>
              </View>
              <Switch
                value={vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ false: Colors.dark.inactive, true: Colors.dark.accent }}
                thumbColor={Colors.dark.text}
              />
            </View>
          </View>
          
          <View style={styles.phraseSection}>
            <View style={styles.phraseHeader}>
              <Feather name="volume-2" size={20} color={Colors.dark.accent} />
              <Text style={styles.phraseTitle}>Emergency Trigger Phrase</Text>
            </View>
            
            <Text style={styles.phraseDescription}>
              Say this phrase to activate emergency mode
            </Text>
            
            <TextInput
              style={styles.input}
              value={triggerPhrase}
              onChangeText={setTriggerPhraseLocal}
              placeholder="e.g., help me"
              placeholderTextColor={Colors.dark.textSecondary}
              editable={voiceEnabled}
            />
          </View>
          
          <View style={styles.phraseSection}>
            <View style={styles.phraseHeader}>
              <Feather name="volume-x" size={20} color={Colors.dark.accent} />
              <Text style={styles.phraseTitle}>Safe Phrase</Text>
            </View>
            
            <Text style={styles.phraseDescription}>
              Say this phrase to cancel emergency mode
            </Text>
            
            <TextInput
              style={styles.input}
              value={safePhrase}
              onChangeText={setSafePhraseLocal}
              placeholder="e.g., I am safe"
              placeholderTextColor={Colors.dark.textSecondary}
              editable={voiceEnabled}
            />
          </View>
          
          <View style={styles.testSection}>
            <Text style={styles.testTitle}>Test Your Phrases</Text>
            <Text style={styles.testDescription}>
              Make sure your phrases are distinct and can be recognized by voice detection. Try speaking them at different volumes.
            </Text>
            
            <Button
              title="Test Voice Recognition"
              onPress={() => {}}
              variant="secondary"
              style={styles.testButton}
              disabled={!voiceEnabled}
            />
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="outline"
          style={styles.footerButton}
        />
        <Button
          title="Save Settings"
          onPress={handleSave}
          variant="primary"
          style={styles.footerButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 700,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Fonts.sizes.md,
    color: Colors.dark.textSecondary,
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.primary + '20',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.dark.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  toggleSection: {
    marginBottom: 24,
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: Fonts.sizes.md,
    color: Colors.dark.text,
    marginLeft: 12,
  },
  phraseSection: {
    marginBottom: 24,
  },
  phraseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  phraseTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: 600,
    color: Colors.dark.text,
    marginLeft: 8,
  },
  phraseDescription: {
    fontSize: Fonts.sizes.sm,
    color: Colors.dark.textSecondary,
    marginBottom: 12,
  },
  input: {
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 16,
    fontSize: Fonts.sizes.md,
    color: Colors.dark.text,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  testSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  testTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: 600,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  testDescription: {
    fontSize: Fonts.sizes.sm,
    color: Colors.dark.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  testButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});