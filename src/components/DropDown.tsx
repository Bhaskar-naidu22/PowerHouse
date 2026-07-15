import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './AppText';
import { Icon } from './IconComponent';

type DropdownProps = {
  placeholder: string;
  value: string;
  onPress: () => void;
  disabled?: boolean;
};

const Dropdown = ({ placeholder, value, onPress, disabled }: DropdownProps) => (
  <TouchableOpacity
    style={[styles.dropdown, disabled && styles.dropdownDisabled]}
    onPress={onPress}
    activeOpacity={0.8}
    disabled={disabled}
  >
    <Icon name="search" size={20} color="#3B5BDB" />
    <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>
      {value || placeholder}
    </Text>
    <Icon name="chevronDown" size={22} color="#3B5BDB" />
  </TouchableOpacity>
);

export default Dropdown;

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  dropdownDisabled: {
    opacity: 0.4,
  },
  dropdownText: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  dropdownPlaceholder: {
    color: '#9CA3AF',
    fontWeight: '400',
  },
});
