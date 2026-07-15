import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native'
import { Text } from './AppText'
import { SensorTypeOption } from '../types';

type Props = {
  option: SensorTypeOption;
  selected: boolean;
  onPress: (id: SensorTypeOption) => void;
};

const SensorTypeCard = ({ option, selected, onPress }: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0}
      disabled={option.count === 0}
      onPress={() => onPress(option)}
      style={[styles.card, selected && styles.selectedCard, option.count == 0 && { opacity: 1 }]}>

      {option.count !== undefined && (
        <View style={[styles.badge]}>
          <Text style={styles.badgeText}>x{option.count}</Text>
        </View>
      )}
      <Image
        source={option.image}
        style={[styles.image, option.count === 0 && {opacity: 0.3}]}
        resizeMode="contain"
      />

      <Text style={[styles.label, selected && styles.labelSelected]}>
        {option.label}
      </Text>
    </TouchableOpacity>
  );
};

export default SensorTypeCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 110,
  },
  selectedCard: {
    borderColor: '#3B5BDB',
    backgroundColor: '#EEF2FF',
  },
  disabledCard: {
  backgroundColor: '#F3F4F6',
  borderColor: 'transparent',
  elevation: 0,
  shadowOpacity: 0,
},
  image: {
    width: 48,
    height: 48,
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  labelSelected: {
    color: '#3B5BDB',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  }
});