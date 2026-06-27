import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '../contexts/SessionContexts';

export default function SuccessScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { sensorType, device } = route.params;
  const { flatDetails } = useSession();

  const handleAddAnother = () => {
    // Navigates back to allow matching additional hardware interfaces
    navigation.replace("Sensor Type");
  };

  const handleGoHome = () => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Animated Checkmark Graphic Shell */}
        <View style={styles.successHeader}>
          <View style={styles.iconCircle}>
            <Text style={styles.checkmarkIcon}>✓</Text>
          </View>
          <Text style={styles.mainTitle}>Configuration Complete</Text>
          <Text style={styles.subTitle}>The sensor has been provisioned successfully and is now broadcasting network packets.</Text>
        </View>

        {/* Dynamic Parameter Metadata Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardSectionTitle}>Deployment Metadata</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Sensor Type</Text>
            <Text style={styles.metaValue}>{sensorType.label} Sensor</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Sensor ID</Text>
            <Text style={styles.metaValue}>{device.id}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Target Building</Text>
            <Text style={styles.metaValue}>{flatDetails?.buildingName}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Unit / Flat</Text>
            <Text style={styles.metaValue}>{flatDetails?.FlatName}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Persistent Base Interface Operational Control Cluster */}
      <View style={styles.footerActionCluster}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={handleAddAnother}
        >
          <Text style={styles.primaryButtonText}>Add Another Sensor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.7}
          onPress={handleGoHome}
        >
          <Text style={styles.secondaryButtonText}>Return to Home Dashboard</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F8',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    gap: 28,
  },
  successHeader: {
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  checkmarkIcon: {
    fontSize: 38,
    color: '#16A34A',
    fontWeight: '700',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  metaLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  footerActionCluster: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: '#F0F2F8',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#3B5BDB',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#3B5BDB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3B5BDB',
  },
  secondaryButtonText: {
    color: '#3B5BDB',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});