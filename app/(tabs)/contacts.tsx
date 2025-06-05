import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import Fonts from '@/constants/fonts';
import { useProfileStore } from '@/store/profileStore';
import { EmergencyContact } from '@/types';
import ContactCard from '@/components/ContactCard';
import Button from '@/components/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // <--- update here

export default function ContactsScreen() {
  const router = useRouter();
  const { profile, updateEmergencyContact, removeEmergencyContact } = useProfileStore();

  const handleAddContact = () => {
    router.push('/contacts/add');
  };

  const handleEditContact = (contact: EmergencyContact) => {
    router.push({
      pathname: '/contacts/edit',
      params: { id: contact.id }
    });
  };

  const handleDeleteContact = (id: string) => {
    removeEmergencyContact(id);
  };

  const handleTogglePrimary = (id: string, isPrimary: boolean) => {
    // If setting as primary, unset all others
    if (isPrimary && profile?.emergencyContacts) {
      profile.emergencyContacts.forEach(contact => {
        if (contact.id !== id && contact.isPrimary) {
          updateEmergencyContact(contact.id, { isPrimary: false });
        }
      });
    }
    updateEmergencyContact(id, { isPrimary });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="account-group-outline" size={48} color={Colors.dark.textSecondary} />
      <Text style={styles.emptyTitle}>No Contacts Added</Text>
      <Text style={styles.emptyText}>
        Add emergency contacts who will be notified in case of an emergency.
      </Text>
      <Button
        title="Add Contact"
        onPress={handleAddContact}
        variant="primary"
        style={styles.emptyButton}
        icon={<MaterialCommunityIcons name="account-plus-outline" size={18} color={Colors.dark.text} />}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Contacts</Text>
        <Text style={styles.subtitle}>
          Manage contacts who will be notified during emergencies
        </Text>
      </View>

      <FlatList
        data={profile?.emergencyContacts || []}
        renderItem={({ item }) => (
          <ContactCard
            contact={item}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
            onTogglePrimary={handleTogglePrimary}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />

      {(profile?.emergencyContacts?.length || 0) > 0 && (
        <View style={styles.footer}>
          <Button
            title="Add New Contact"
            onPress={handleAddContact}
            variant="primary"
            icon={<MaterialCommunityIcons name="account-plus-outline" size={18} color={Colors.dark.text} />}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: "700", // was Fonts.weights.bold
    color: Colors.dark.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Fonts.sizes.md,
    color: Colors.dark.textSecondary,
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: Fonts.sizes.xl,
    fontWeight: "600", // was Fonts.weights.semibold
    color: Colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: Fonts.sizes.md,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    maxWidth: '80%',
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 160,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
});
