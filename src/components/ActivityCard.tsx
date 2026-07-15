import { StyleSheet, View } from 'react-native';
import { Text } from './AppText';
import { ActivityItem } from '../types';
import { Icon } from './IconComponent';

const BRAND = '#3B5BDB';

export const ActivityCard = ({ item }: { item: ActivityItem }) => {
  const isCompleted = item.status === 'Completed';

  return (
    <View style={styles.activityCard}>
      <View style={styles.activityIconWrapper}>
        <Icon name="building" size={22} color="#FFFFFF" />
      </View>

      <View style={styles.activityMainContent}>
        <Text style={styles.buildingText}>{item.building}</Text>
        <Text style={styles.detailsText}>{item.details}</Text>
      </View>

      <View style={styles.activityMeta}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: isCompleted ? '#DCFCE7' : '#FEF3C7' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: isCompleted ? '#16A34A' : '#D97706' },
            ]}
          >
            {item.status}
          </Text>
        </View>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  activityIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#6B8FF0',
  },
  activityMainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  buildingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  detailsText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  activityMeta: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 44,
  },
  timeText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
