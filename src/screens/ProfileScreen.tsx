import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native'
import { Text } from '../components/AppText'
import { ContactRow } from '../components/ContactRowCard';
import { useNavigation } from '@react-navigation/native';
import { StatCard } from '../components/StatCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import UiModeToggle from '../components/UiModeToggle';
import UiModeScreenPicker from '../components/UiModeScreenPicker';

const ProfileScreen = () => {
  const navigation = useNavigation<any>()

  const handleSignOut = () => {
    navigation.replace("LoginScreen")
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ── */}
        {/* <View style={styles.header}> */}
          <View style={styles.avatarWrap}>
            {/* Replace uri with actual image source */}
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editBadge} activeOpacity={0.8}>
              <Text style={styles.editBadgeIcon}>✎</Text>
            </TouchableOpacity>
          </View>
        {/* </View> */}

        {/* ── Identity ── */}
        <View style={styles.identityBlock}>
          <Text style={styles.name}>Lokesh Kota</Text>
          <Text style={styles.employeeId}>Employee ID: ASSPPL-12345</Text>
          <View style={styles.rolePill}>
            <Text style={styles.roleText}>Field Electrician</Text>
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={styles.statsRow}>
          <StatCard icon="building" value={124} label="Flats" color="#3B5BDB" />
          <View style={styles.statDivider} />
          <StatCard icon="sensors" value={432} label="Sensors" color="#3B5BDB" />
          <View style={styles.statDivider} />
          <StatCard icon="calendarStat" value={582} label="Days" color="#3B5BDB" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACT INFORMATION</Text>

          <ContactRow
            icon="email"
            label="Email"
            value="info@asspl.com"
          />
          <ContactRow
            icon="phone"
            label="Mobile"
            value="+91 9876543210"
          />
          <ContactRow
            icon="location"
            label="Zone"
            value="E-City"
          />
          <ContactRow
            icon="calendar"
            label="Join Date"
            value="March 12, 2026"
          />
        </View>

        {/* ── Edit Profile Button ── */}
        {/* <TouchableOpacity style={styles.editBtn} activeOpacity={0.85}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.85} onPress={handleSignOut}>
          <Text style={styles.signOutBtnText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* TEMP: UI Mode — floating corner */}
      <View style={styles.uiModeCorner} pointerEvents="box-none">
        <UiModeScreenPicker compact />
        <UiModeToggle compact />
      </View>

    </SafeAreaView>
  );
};

export default ProfileScreen;

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    marginTop: -23,
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  uiModeCorner: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    zIndex: 50,
    alignItems: 'flex-end',
    maxWidth: 280,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 10,
  },

  // Header
  header: {
    backgroundColor: '#32dafbe3',
    height: 100,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 0
  },
  avatarWrap: {
    position: 'relative',
    alignItems: 'center',
    marginTop: 75,
    zIndex: 100,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#CBD5E1',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right:150,
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editBadgeIcon: {
    color: '#fff',
    fontSize: 15,
  },

  // Identity
  identityBlock: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 24,
    backgroundColor: '#F1F5F9',
    paddingBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  employeeId: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  rolePill: {
    marginTop: 10,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleText: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: '600',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 14,
    paddingVertical: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 6,
  },

  // Contact Section
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.1,
    marginBottom: 12,
  },


  // Edit Button
  editBtn: {
    marginHorizontal: 16,
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  editBtnText: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '600',
  },
  signOutBtn: {
    marginHorizontal: 16,
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: '#f82929',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#f51717',
  },
  signOutBtnText: {
    color: '#fcfafa',
    fontSize: 15,
    fontWeight: '600',
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  activeTabPill: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 6,
  },
  activeTabLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  inactiveTabLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
});