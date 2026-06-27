import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { StatCard } from '../components/StatCard';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityCard } from '../components/ActivityCard';
import { RECENT_ACTIVITY_DATA } from '../utils/RecentActivityData';



export default function HomeScreen() {
  const navigation = useNavigation<any>()
  const handlePlusButton = () => {
    navigation.navigate("PropertySelectionScreen")
  }
  const handleProfileIconPress = () => {
    navigation.navigate("MainTabs", { screen: "Profile" });
  }
  const handleViewAll = () => {
    navigation.navigate("MainTabs", { screen: "Flats" })
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header Profile Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>
            Hii, Lokesh <Text style={styles.waveEmoji}>👋</Text>
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
            <Text style={{ fontSize: 22 }}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="profile-icon" onPress={handleProfileIconPress}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
              style={styles.avatar}
            /></TouchableOpacity>
        </View>
      </View>

      {/* Metrics Grid Row */}
      <View style={styles.statsContainer}>
        <StatCard label="Flats Completed" value="12" icon="building" color="#2563EB" />
        <View style={styles.statDivider} />
        <StatCard label="Sensors" value="148" icon="sensors" color="#16A34A" />
        <View style={styles.statDivider} />
        <StatCard label="Pending" value="04" icon="pending" color="#EA580C" />
      </View>

      {/* Recent Activity Label Row */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity activeOpacity={0.6} onPress={handleViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Activity List Section */}
      <FlatList
        testID='recent-activity'
        data={RECENT_ACTIVITY_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActivityCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={handlePlusButton}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Soft modern background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  waveEmoji: {
    fontSize: 18,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notificationButton: {
    position: 'relative',
    padding: 4,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 28,
    marginTop: 20,
    gap: 10,
  },
  statDivider: {
    width: 5,
    backgroundColor: '#b9d0ef',
    marginVertical: 6,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    // paddingvertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  statCardActive: {
    backgroundColor: '#2563EB',
  },
  statCardInactive: {
    backgroundColor: '#FFFFFF',
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Clearance for FAB placement
    gap: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#004DE3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 30,
  },
});