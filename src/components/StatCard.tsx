import { StyleSheet, View } from 'react-native';
import { Text } from './AppText';
import { Icon } from './IconComponent';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  color: string;
  /** White text/icons for dark/gradient backgrounds */
  light?: boolean;
}

export const StatCard = ({
  icon,
  value,
  label,
  color,
  light = false,
}: StatCardProps) => (
  <View style={styles.statCard}>
    <Icon name={icon} size={22} color={color} />
    <Text style={[styles.statValue, light && styles.statValueLight]}>{value}</Text>
    <Text style={[styles.statLabel, light && styles.statLabelLight]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  statValueLight: {
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  statLabelLight: {
    color: 'rgba(255,255,255,0.9)',
  },
});
