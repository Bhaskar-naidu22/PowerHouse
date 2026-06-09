import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Device, SensorTypeOption } from '../types';

// ─── Device Card ──────────────────────────────────────────────────────────────

interface Props {
  device: Device;
  sensortype: SensorTypeOption;
  onConnect: (id: string) => Promise<void>;
}

const DeviceCard: React.FC<Props> = ({ device, sensortype, onConnect }) => {



  return (
    <View style={styles.card}>
      <View style={styles.iconWrapper}>
        <Image
          source={sensortype.image}
          style={styles.iconText}
          resizeMode="contain"
        />
      </View>

      <View style={styles.info}>
        <Text style={[styles.name]}>
          {sensortype.label} Sensor
        </Text>
        <Text style={styles.mac}>MAC: {device.id}</Text>
      </View>

      <View style={styles.action}>

        <TouchableOpacity
          style={styles.connectButton}
          activeOpacity={0.75}
          onPress={() => onConnect(device.id)}>
          <Text style={styles.connectButtonText}>Connect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeviceCard;

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 30,
    paddingHorizontal: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  iconText: {
    width: 60,
    height: 60,
    marginBottom: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  nameMuted: {
    color: '#9CA3AF',
  },
  mac: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
    letterSpacing: 0.3,
  },

  signalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 16,
  },
  signalBar: {
    width: 4,
    borderRadius: 1,
  },
  action: {
    marginLeft: 8,
    alignItems: 'flex-end',
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  connectedCheck: {
    fontSize: 16,
    color: '#22C55E',
    fontWeight: '700',
  },
  connectedText: {
    fontSize: 13,
    color: '#22C55E',
    fontWeight: '600',
  },
  connectButton: {
    borderWidth: 1.5,
    borderColor: '#3B5BDB',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  connectButtonText: {
    fontSize: 13,
    color: '#3B5BDB',
    fontWeight: '600',
  },
  lowSignalBadge: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  lowSignalText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
});