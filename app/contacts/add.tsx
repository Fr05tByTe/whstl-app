import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import Fonts from '@/constants/fonts';
import Button from '@/components/Button';
import { useProfileStore } from '@/store/profileStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AddContactScreen() {
  const router = useRouter();
  const { addEmergencyContact } = useProfileStore();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const validateForm = () => {
    if (!name || !phone) {
      setValidationError('Name and phone number are required');
      return false;
    }
    if (email && !email.includes('@')) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    setValidationError(null);
    return true;
  };
  
  const handleSave = () => {
    if (!validateForm()) return;
    addEmergencyContact({
      name,
      phone,
      email: email || undefined,
      isPrimary,
    });
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
          <Text style={styles.title}>Add Emergency Contact</Text>
          <Text style={styles.subtitle}>
            This person will be notified during emergencies
          </Text>
          
          {validationError && (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-outline" size={18} color={Colors.dark.danger} />
              <Text style={styles.errorText}>{validationError}</Text>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter contact name"
              placeholderTextColor={Colors.dark.textSecondary}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor={Colors.dark.textSecondary}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email (Optional)</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email address"
              placeholderTextColor={Colors.dark.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.switchContainer}>
            <View>
              <Text style={styles.switchLabel}>Primary Contact</Text>
              <Text style={styles.switchDescription}>
                This contact will be prioritized during emergencies
              </Text>
            </View>
            <Switch
              value={isPrimary}
              onValueChange={setIsPrimary}
              trackColor={{ false: Colors.dark.inactive, true: Colors.dark.accent }}
              thumbColor={Colors.dark.text}
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
          title="Save Contact"
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
    fontWeight: "700",
    color: Colors.dark.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Fonts.sizes.md,
    color: Colors.dark.textSecondary,
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.danger + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.dark.danger,
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: Fonts.sizes.sm,
    fontWeight: "500",
    color: Colors.dark.text,
    marginBottom: 8,
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: Fonts.sizes.md,
    fontWeight: "500",
    color: Colors.dark.text,
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: Fonts.sizes.sm,
    color: Colors.dark.textSecondary,
    maxWidth: '80%',
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
