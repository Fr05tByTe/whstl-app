import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import Fonts from '@/constants/fonts';
import { useSafetyStore } from '@/store/safetyStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AlertsScreen() {
  const { recentAlerts } = useSafetyStore();
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'voice':
        return <MaterialCommunityIcons name="account-voice" size={20} color={Colors.dark.text} />;
      case 'button':
        return <MaterialCommunityIcons name="gesture-double-tap" size={20} color={Colors.dark.text} />;
      case 'timer':
        return <MaterialCommunityIcons name="timer-outline" size={20} color={Colors.dark.text} />;
      case 'manual':
      default:
        return <MaterialCommunityIcons name="alert-outline" size={20} color={Colors.dark.text} />;
    }
  };
  
  const getAlertTypeText = (type: string) => {
    switch (type) {
      case 'voice':
        return 'Voice Trigger';
      case 'button':
        return 'Volume Button';
      case 'timer':
        return 'Check-In Timer';
      case 'manual':
      default:
        return 'Manual Trigger';
    }
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <LinearGradient
        colors={[Colors.dark.primary + '40', Colors.dark.background]}
        style={styles.emptyGradient}
      >
        <MaterialCommunityIcons name="alert-outline" size={48} color={Colors.dark.textSecondary} />
        <Text style={styles.emptyTitle}>No Alerts Yet</Text>
        <Text style={styles.emptyText}>
          Your recent emergency alerts will appear here.
        </Text>
      </LinearGradient>
    </View>
  );
  
  const renderAlertItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.alertItem}>
      <View style={styles.alertHeader}>
        <View style={styles.alertTypeContainer}>
          {getAlertIcon(item.type)}
          <Text style={styles.alertType}>{getAlertTypeText(item.type)}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          item.status === 'sent' 
            ? styles.statusSent 
            : item.status === 'failed' 
              ? styles.statusFailed 
              : styles.statusSending
        ]}>
          <Text style={styles.statusText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.alertTime}>{formatDate(item.timestamp)}</Text>
      
      <View style={styles.alertDetails}>
        {item.location && (
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="map-marker-outline" size={16} color={Colors.dark.accent} />
            <Text style={styles.detailText}>
              Location shared: {item.location.latitude.toFixed(6)}, {item.location.longitude.toFixed(6)}
            </Text>
          </View>
        )}
        
        {item.recordingUrl && (
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="microphone-outline" size={16} color={Colors.dark.accent} />
            <Text style={styles.detailText}>Audio recording uploaded</Text>
          </View>
        )}
        
        {item.sentTo.length > 0 && (
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="share-outline" size={16} color={Colors.dark.accent} />
            <Text style={styles.detailText}>
              Sent to {item.sentTo.length} contact{item.sentTo.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Alerts</Text>
        <Text style={styles.subtitle}>
          View your recent emergency alerts and their status
        </Text>
      </View>
      
      <FlatList
        data={recentAlerts}
        renderItem={renderAlertItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ...your styles here (unchanged)
  // (copy your style block as above)
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
    fontWeight: 700,
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
  emptyGradient: {
    width: '100%',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 600,
    color: Colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: Fonts.sizes.md,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  alertItem: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.dark.accent,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertType: {
    fontSize: Fonts.sizes.md,
    fontWeight: 600,
    color: Colors.dark.text,
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusSent: {
    backgroundColor: Colors.dark.success + '33', // 20% opacity
  },
  statusFailed: {
    backgroundColor: Colors.dark.danger + '33', // 20% opacity
  },
  statusSending: {
    backgroundColor: Colors.dark.warning + '33', // 20% opacity
  },
  statusText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: 500,
    color: Colors.dark.text,
  },
  alertTime: {
    fontSize: Fonts.sizes.sm,
    color: Colors.dark.textSecondary,
    marginBottom: 12,
  },
  alertDetails: {
    backgroundColor: Colors.dark.background + '80',
    borderRadius: 8,
    padding: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.dark.text,
    marginLeft: 8,
  },
});
