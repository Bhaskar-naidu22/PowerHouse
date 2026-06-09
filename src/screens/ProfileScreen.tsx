import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';

// ── Icons (replace with react-native-vector-icons if available) ──────────────
const Icon = ({ name, size = 18, color = '#2563EB' }: { name: string; size?: number; color?: string }) => {
  const icons: Record<string, string> = {
    email: '✉',
    phone: '📱',
    location: '📍',
    calendar: '📅',
    home: '⊞',
    flats: '⊟',
    sensors: '◎',
    profile: '👤',
    edit: '✎',
    building: '⊞',
    wifi: '◎',
    calendarStat: '▦',
  };
  return (
    <Text style={{ fontSize: size, color }}>{icons[name] ?? '•'}</Text>
  );
};

// ── Types ────────────────────────────────────────────────────────────────────
interface ContactRowProps {
  icon: string;
  label: string;
  value: string;
}

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
}

// ── Sub-components ───────────────────────────────────────────────────────────
const StatCard = ({ icon, value, label }: StatCardProps) => (
  <View style={styles.statCard}>
    <Icon name={icon} size={22} color="#2563EB" />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ContactRow = ({ icon, label, value }: ContactRowProps) => (
  <View style={styles.contactRow}>
    <View style={styles.contactIconWrap}>
      <Icon name={icon} size={16} color="#2563EB" />
    </View>
    <View>
      <Text style={styles.contactLabel}>{label}</Text>
      <Text style={styles.contactValue}>{value}</Text>
    </View>
  </View>
);

// ── Main Screen ──────────────────────────────────────────────────────────────
const ProfileScreen = () => {
  const activeTab = 'Profile';

  const tabs = [
    { name: 'Home', icon: 'home' },
    { name: 'Flats', icon: 'flats' },
    { name: 'Sensors', icon: 'sensors' },
    { name: 'Profile', icon: 'profile' },
  ];

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1D4ED8" />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
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
        </View>

        {/* ── Identity ── */}
        <View style={styles.identityBlock}>
          <Text style={styles.name}>Alex Thompson</Text>
          <Text style={styles.employeeId}>Employee ID: EP-99284</Text>
          <View style={styles.rolePill}>
            <Text style={styles.roleText}>Field Electrician</Text>
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={styles.statsRow}>
          <StatCard icon="building" value={124} label="Flats" />
          <View style={styles.statDivider} />
          <StatCard icon="sensors" value={432} label="Sensors" />
          <View style={styles.statDivider} />
          <StatCard icon="calendarStat" value={582} label="Days" />
        </View>

        {/* ── Contact Information ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACT INFORMATION</Text>

          <ContactRow
            icon="email"
            label="Email"
            value="a.thompson@electropro.com"
          />
          <ContactRow
            icon="phone"
            label="Mobile"
            value="+1 (555) 024-9182"
          />
          <ContactRow
            icon="location"
            label="Zone"
            value="Metropolis North - Sector 7"
          />
          <ContactRow
            icon="calendar"
            label="Join Date"
            value="March 12, 2022"
          />
        </View>

        {/* ── Edit Profile Button ── */}
        <TouchableOpacity style={styles.editBtn} activeOpacity={0.85}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Bottom Tab Bar ── */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = tab.name === activeTab;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              {isActive ? (
                <View style={styles.activeTabPill}>
                  <Icon name={tab.icon} size={18} color="#fff" />
                  <Text style={styles.activeTabLabel}>{tab.name}</Text>
                </View>
              ) : (
                <>
                  <Icon name={tab.icon} size={20} color="#9CA3AF" />
                  <Text style={styles.inactiveTabLabel}>{tab.name}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default ProfileScreen;

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  // Header
  header: {
    backgroundColor: '#1D4ED8',
    height: 100,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 0,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: -36,
    zIndex: 10,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#CBD5E1',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editBadgeIcon: {
    color: '#fff',
    fontSize: 13,
  },

  // Identity
  identityBlock: {
    alignItems: 'center',
    marginTop: 44,
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
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
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
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 14,
  },
  contactIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
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