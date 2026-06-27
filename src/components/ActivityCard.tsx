import { StyleSheet, Text, View } from "react-native";
import { ActivityItem } from "../types";


export const ActivityCard = ({ item }: { item: ActivityItem }) => {
    const isCompleted = item.status === 'Completed';

    return (
        <View style={[
            styles.activityCard,
            isCompleted ? styles.borderBlue : styles.borderOrange
        ]}>
            {/* Icon Placeholder */}
            <View style={[styles.activityIconWrapper, { backgroundColor: isCompleted ? '#EEF2FF' : '#FFF7ED' }]}>
                <Text style={{ fontSize: 18, color: isCompleted ? '#2563EB' : '#EA580C' }}>🏢</Text>
            </View>

            {/* Text Details */}
            <View style={styles.activityMainContent}>
                <Text style={styles.buildingText}>{item.building}</Text>
                <Text style={styles.detailsText}>{item.details}</Text>
            </View>

            {/* Meta (Time & Status badge) */}
            <View style={styles.activityMeta}>
                <Text style={styles.timeText}>{item.time}</Text>
                <View style={[
                    styles.statusBadge,
                    { backgroundColor: isCompleted ? '#DCFCE7' : '#FEF3C7' }
                ]}>
                    <Text style={[
                        styles.statusText,
                        { color: isCompleted ? '#16A34A' : '#D97706' }
                    ]}>
                        {item.status}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    activityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        borderLeftWidth: 5,
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    borderBlue: {
        borderLeftColor: '#2563EB',
    },
    borderOrange: {
        borderLeftColor: '#EA580C',
    },
    activityIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityMainContent: {
        flex: 1,
        justifyContent: 'center',
    },
    
  buildingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  detailsText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  activityMeta: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 44,
  },
  timeText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
})