import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text } from '../components/AppText'
import React, { useCallback, useState } from 'react'
import { SensorTypeOption } from '../types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SensorTypeCard from '../components/SensorTypeCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const SENSOR_OPTIONS: SensorTypeOption[] = [
  { id: 'asspl-001', label: 'IR', image: require('../assets/images/IR.png'), count: 5 },
  { id: 'asspl-002', label: 'Relay', image: require('../assets/images/SmartRelay.png'), count: 1 },
  { id: 'asspl-003', label: 'Temp', image: require('../assets/images/TempSensor.png'), count: 1 },
  { id: 'asspl-004', label: 'Camera', image: require('../assets/images/SmartDoorBell.png'), count: 3 },
  { id: 'asspl-005', label: 'Radar', image: require('../assets/images/RadarDevice.png'), count: 0 },
];

const SensorTypeScreen = () => {
  const [selected, setSelected] = useState<SensorTypeOption | null>(null)
  const navigation = useNavigation<any>()

  useFocusEffect(
    useCallback(() => {
      setSelected(null) // reset selection when screen is focused
    }, [])
  )
  const handleContinue = () => {
    if (!selected) {
      return
    }
    navigation.navigate("NearByScreen", { sensorType: selected })
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollContent}>
        <Text style={styles.title} >Select Sensor Type</Text>
        <Text style={styles.subtitle} >Choose the sensor you want to configure for the current electrical node.</Text>
        <View style={styles.grid}>
          {SENSOR_OPTIONS.map((option, index) => {
            if (index % 2 !== 0) return null;
            return (
              <View key={option.id} style={styles.row}>
                <SensorTypeCard
                  option={option}
                  selected={selected?.id === option.id}
                  onPress={setSelected}
                />
                {SENSOR_OPTIONS[index + 1] ? (
                  <SensorTypeCard
                    option={SENSOR_OPTIONS[index + 1]}
                    selected={selected?.id === SENSOR_OPTIONS[index + 1].id}
                    onPress={setSelected}
                  />
                ) : (
                  <View style={{ flex: 1, margin: 6 }} /> // empty filler
                )}
              </View>
            )
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !selected && styles.continueDisabled]}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView >
  )
}

export default SensorTypeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F8'
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  backArrow: {
    fontSize: 30,
    color: '#3B5BDB',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#325fc0',
    marginTop: 8,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 24,
  },
  grid: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 45,
    backgroundColor: '#F0F2F8',
  },
  continueButton: {
    backgroundColor: '#2154ec',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueDisabled: {
    opacity: 0.5,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});