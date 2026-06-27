import { StyleSheet, Text, TouchableOpacity } from "react-native";

type DropdownProps = {
    placeholder: string;
    value: string;
    onPress: () => void;
    disabled?: boolean;
}

const Dropdown = ({ placeholder, value, onPress, disabled }: DropdownProps) => (
    <TouchableOpacity
        style={[styles.dropdown, disabled && styles.dropdownDisabled]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled}>
        <Text style={styles.dropdownSearchIcon}>🔍</Text>
        <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>
            {value || placeholder}
        </Text>
        <Text style={styles.dropdownChevron}>⌄</Text>
    </TouchableOpacity>
)

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
    },
    dropdownDisabled: {
        opacity: 0.4,
    },
    dropdownSearchIcon: {
        fontSize: 14,
        marginRight: 8,
        color: '#9CA3AF',
    },
    dropdownText: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
        fontWeight: '500',
    },
    dropdownPlaceholder: {
        color: '#9CA3AF',
        fontWeight: '400',
    },
    dropdownChevron: {
        fontSize: 18,
        color: '#6B7280',
        marginLeft: 8,
    }
});
