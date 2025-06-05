import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import Fonts from '@/constants/fonts';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import Button from '@/components/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { profile } = useProfileStore();

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);
  const [recordingEnabled, setRecordingEnabled] = React.useState(true);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <LinearGradient
                colors={[Colors.dark.primary, Colors.dark.accent]}
                style={styles.profileGradient}
              >
                <Text style={styles.profileInitial}>
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </LinearGradient>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile?.name || 'User'}</Text>
              <Text style={styles.profileEmail}>{profile?.email || 'user@example.com'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigateTo('/settings/account')}
          >
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="account-circle-outline" size={20} color={Colors.dark.accent} />
              <Text style={styles.settingText}>Profile Settings</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.dark.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigateTo('/settings/phrases')}
          >
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="account-voice" size={20} color={Colors.dark.accent} />
              <Text style={styles.settingText}>Voice Trigger Phrases</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.dark.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigateTo('/contacts')}
          >
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="account-group-outline" size={20} color={Colors.dark.accent} />
              <Text style={styles.settingText}>Emergency Contacts</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.dark.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigateTo('/settings/fakecall')}
          >
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="phone" size={20} color={Colors.dark.accent} />
              <Text style={styles.settingText}>Fake Call Settings</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.dark.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="bell-outline" size={20} color={Colors.dark.accent} />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.dark.inactive, true: Colors.dark.accent }}
              thumbColor={Colors.dark.text}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="timer-outline" size={20} color={Colors.dark.accent} />
              <Text style={styles.settingText}>Timer Reminders</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.dark.inactive, true: Colors.dark.accent }}
              thumbColor={Colors.dark.text}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="map-marker-outline" size={20} color={Colors.dark.accent} />
              <Text style={styles.settingText}>Location Sharing</Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: Colors.dark.inactive, true: Colors.dark.accent }}
              thumbColor={Colors.dark.text}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="microphone-outline" size={20} color={Colors.dark.accent} />
              <Text style={styles.settingText}>Audio Recording</Text>
            </View>
            <Switch
              value={recordingEnabled}
              onValueChange={setRecordingEnabled}
              trackColor={{ false: Colors.dark.inactive, true: Colors.dark.accent }}
              thumbColor={Colors.dark.text}
            />
          </View>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {}}
          >
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="shield-lock-outline" size={20} color={Colors.dark.accent} />
              <Text style={styles.settingText}>Data Encryption</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.dark.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="help-circle-outline" size={20} color={Colors.dark.accent} />
              <Text style={styles.settingText}>Help & FAQ</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.dark.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="cog-outline" size={20} color={Colors.dark.accent} />
              <Text style={styles.settingText}>App Settings</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.dark.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.logoutSection}>
          <Button
            title="Log Out"
            onPress={handleLogout}
            variant="outline"
            icon={<MaterialCommunityIcons name="logout" size={18} color={Colors.dark.accent} />}
          />
        </View>

        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>WHSTL v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    marginRight: 16,
  },
  profileGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.dark.text,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: Fonts.sizes.xl,
    fontWeight: "700",
    color: Colors.dark.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: Fonts.sizes.sm,
    color: Colors.dark.textSecondary,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: Fonts.sizes.md,
    color: Colors.dark.text,
    marginLeft: 12,
  },
  logoutSection: {
    padding: 20,
    marginBottom: 12,
  },
  versionInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  versionText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.dark.textSecondary,
  },
});
