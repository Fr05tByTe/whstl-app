import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import Fonts from '@/constants/fonts';
import Button from '@/components/Button';
import { useFakeCallStore } from '@/store/fakeCallStore';
import { Feather } from '@expo/vector-icons'; // <-- UPDATED

import * as ImagePicker from 'expo-image-picker';

export default function FakeCallSettingsScreen() {
  const router = useRouter();
  const { callerName, callerImage, ringtone, updateCallerName, updateCallerImage } = useFakeCallStore();
  
  const [name, setName] = useState(callerName);
  const [image, setImage] = useState<string | null>(callerImage);
  
  useEffect(() => {
    setName(callerName);
    setImage(callerImage);
  }, [callerName, callerImage]);
  
  const handleSave = () => {
    updateCallerName(name);
    updateCallerImage(image);
    router.back();
  };
  
  const handlePickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library to select a caller image.');
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };
  
  const handleRemoveImage = () => {
    setImage(null);
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Fake Call Settings</Text>
        <Text style={styles.subtitle}>
          Customize how your fake calls appear
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Feather name="phone" size={18} color={Colors.dark.accent} /> Caller Information
        </Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Caller Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter caller name"
            placeholderTextColor={Colors.dark.textSecondary}
          />
        </View>
        
        <View style={styles.imageSection}>
          <Text style={styles.inputLabel}>Caller Image</Text>
          
          <View style={styles.imageContainer}>
            {image ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={handleRemoveImage}
                >
                  <Feather name="x" size={16} color={Colors.dark.text} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.noImageContainer}>
                <Feather name="user" size={40} color={Colors.dark.textSecondary} />
              </View>
            )}
            
            <Button
              title={image ? "Change Image" : "Add Image"}
              onPress={handlePickImage}
              variant="secondary"
              icon={<Feather name="image" size={18} color={Colors.dark.text} />}
              style={styles.imageButton}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Feather name="music" size={18} color={Colors.dark.accent} /> Ringtone
        </Text>
        
        <View style={styles.ringtoneContainer}>
          <Text style={styles.ringtoneText}>Default Ringtone</Text>
          <TouchableOpacity style={styles.changeRingtoneButton}>
            <Text style={styles.changeRingtoneText}>Change</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.helpText}>
          Custom ringtones are only played during fake calls and won't affect your device's actual ringtone settings.
        </Text>
      </View>
      
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
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
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: 600,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: Fonts.sizes.sm,
    fontWeight: 500,
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
  imageSection: {
    marginBottom: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagePreviewContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: 16,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.dark.danger,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  imageButton: {
    flex: 1,
  },
  ringtoneContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  ringtoneText: {
    fontSize: Fonts.sizes.md,
    color: Colors.dark.text,
  },
  changeRingtoneButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  changeRingtoneText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.dark.text,
    fontWeight: 500,
  },
  helpText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.dark.textSecondary,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});