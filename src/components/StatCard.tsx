import { StyleSheet, Text, View } from "react-native";
import { Icon } from "./IconComponent";

interface StatCardProps {
    icon: string;
    value: string | number;
    label: string;
    color: string;
}
export const StatCard = ({ icon, value, label, color }: StatCardProps) => (
    <View style={styles.statCard}>
        <Icon name={icon} size={22} color= {color} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
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
    }
})