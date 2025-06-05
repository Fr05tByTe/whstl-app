import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/colors';
import Fonts from '@/constants/fonts';
import Button from '@/components/Button';
import { useProfileStore } from '@/store/profileStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function EditContactScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile, updateEmergencyContact, removeEmergencyContact } = useProfileStore();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  
  const [validationError, setValidationError] = useState<string | null>(null);
  
  useEffect(() => {
    if (profile && id) {
      const contact = profile.emergencyContacts.find(c => c.id === id);
      if (contact) {
        setName(contact.name);
        setPhone(contact.phone);
        setEmail(contact.email || '');
        setIsPrimary(contact.isPrimary);
      }
    }
  }, [profile, id]);
  
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
    if (!validateForm() || !id) return;
    updateEmergencyContact(id, {
      name,
      phone,
      email: email || undefined,
      isPrimary,
    });
    router.back();
  };
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete this contact?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            if (id) {
              removeEmergencyContact(id);
              router.back();
            }
          },
          style: "destructive"
        }
      ]
    );
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Edit Emergency Contact</Text>
          
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
          
          <Button
            title="Delete Contact"
            onPress={handleDelete}
            variant="danger"
            style={styles.deleteButton}
            icon={<MaterialCommunityIcons name="trash-can-outline" size={18} color={Colors.dark.text} />}
          />
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
          title="Save Changes"
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
    marginBottom: 24,
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
  deleteButton: {
    marginBottom: 16,
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
