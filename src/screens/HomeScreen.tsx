import React from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from '../components/AppText';
import { StatCard } from '../components/StatCard';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityCard } from '../components/ActivityCard';
import { RECENT_ACTIVITY_DATA } from '../utils/RecentActivityData';
import { Icon } from '../components/IconComponent';

const BRAND = '#3B5BDB';

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const handlePlusButton = () => {
    navigation.navigate('PropertySelectionScreen');
  };
  const handleProfileIconPress = () => {
    navigation.navigate('MainTabs', { screen: 'Profile' });
  };
  const handleViewAll = () => {
    navigation.navigate('MainTabs', { screen: 'Flats' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <View>
          <Text style={styles.greetingLabel}>Welcome back</Text>
          <View style={styles.greetingRow}>
            <Text style={styles.greetingText}>Hii, Lokesh</Text>
            <Icon name="handWave" size={20} color={BRAND} />
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
            <Icon name="notifications" size={22} color={BRAND} />
          </TouchableOpacity>
          <TouchableOpacity testID="profile-icon" onPress={handleProfileIconPress}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      <LinearGradient
        colors={['#3B5BDB', '#93C5FD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsContainer}
      >
        <StatCard label="Flats Completed" value="12" icon="building" color="#FFFFFF" light />
        <View style={styles.statDivider} />
        <StatCard label="Sensors" value="148" icon="sensors" color="#FFFFFF" light />
        <View style={styles.statDivider} />
        <StatCard label="Pending" value="04" icon="pending" color="#FFFFFF" light />
      </LinearGradient>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity activeOpacity={0.6} onPress={handleViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        testID="recent-activity"
        data={RECENT_ACTIVITY_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActivityCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={handlePlusButton}
      >
        <Icon name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  greetingLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 2,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.35)',
    marginVertical: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: BRAND,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BRAND,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
  },
});
