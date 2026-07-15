import { StyleSheet, View } from "react-native"
import { Text } from './AppText'
import { Icon } from "./IconComponent";

interface ContactRowProps {
  icon: string;
  label: string;
  value: string;
}
export const ContactRow = ({ icon, label, value }: ContactRowProps) => (
  <View style={styles.contactRow}>
    <View style={styles.contactIconWrap}>
      <Icon name={icon} size={16} color="#3B5BDB" />
    </View>
    <View>
      <Text style={styles.contactLabel}>{label}</Text>
      <Text style={styles.contactValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
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
  }
})