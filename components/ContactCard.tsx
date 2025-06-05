import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { EmergencyContact } from '@/types';
import Colors from '@/constants/colors';
import Fonts from '@/constants/fonts';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type ContactCardProps = {
  contact: EmergencyContact;
  onEdit: (contact: EmergencyContact) => void;
  onDelete: (id: string) => void;
  onTogglePrimary: (id: string, isPrimary: boolean) => void;
};

export default function ContactCard({
  contact,
  onEdit,
  onDelete,
  onTogglePrimary
}: ContactCardProps) {
  return (
    <View style={[
      styles.container,
      contact.isPrimary && styles.primaryContainer
    ]}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{contact.name}</Text>
        
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="phone-outline" size={16} color={Colors.dark.textSecondary} />
          <Text style={styles.detailText}>{contact.phone}</Text>
        </View>
        
        {contact.email && (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="email-outline" size={16} color={Colors.dark.textSecondary} />
            <Text style={styles.detailText}>{contact.email}</Text>
          </View>
        )}
        
        {contact.isPrimary && (
          <View style={styles.primaryBadge}>
            <MaterialCommunityIcons name="star" size={12} color={Colors.dark.text} />
            <Text style={styles.primaryText}>Primary</Text>
          </View>
        )}
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onTogglePrimary(contact.id, !contact.isPrimary)}
        >
        <MaterialCommunityIcons
          name={contact.isPrimary ? "star" : "star-outline"}
          size={20}
          color={contact.isPrimary ? Colors.dark.warning : Colors.dark.textSecondary}
        />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onEdit(contact)}
        >
          <MaterialCommunityIcons name="pencil-outline" size={20} color={Colors.dark.accent} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onDelete(contact.id)}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={20} color={Colors.dark.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderLeftWidth: 0,
    borderLeftColor: 'transparent',
  },
  primaryContainer: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.dark.warning,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: Fonts.sizes.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.dark.textSecondary,
    marginLeft: 8,
  },
  primaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.warning + '33', // 20% opacity
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  primaryText: {
    fontSize: Fonts.sizes.xs,
    color: Colors.dark.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  actionsContainer: {
    justifyContent: 'space-between',
    paddingLeft: 12,
  },
  actionButton: {
    padding: 6,
  },
});