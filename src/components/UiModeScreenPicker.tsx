import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text } from './AppText'
import { useNavigation } from '@react-navigation/native';
import {
  UI_MODE_MOCK_DEVICE,
  UI_MODE_MOCK_FLAT,
  UI_MODE_MOCK_SENSOR,
  useUiMode,
} from '../contexts/UiModeContext';
import { useSession } from '../contexts/SessionContexts';

type ScreenJump = {
  label: string;
  navigate: () => void;
};

/** TEMPORARY — remove with UiModeContext once UI work is finished. */
export default function UiModeScreenPicker({ compact = false }: { compact?: boolean }) {
  const { uiMode } = useUiMode();
  const navigation = useNavigation<any>();
  const { setFlatDetails } = useSession();

  if (!uiMode) {
    return null;
  }

  const ensureMockSession = () => {
    setFlatDetails(UI_MODE_MOCK_FLAT);
  };

  const screens: ScreenJump[] = [
    {
      label: 'Splash',
      navigate: () => navigation.navigate('SplashScreen'),
    },
    {
      label: 'Login',
      navigate: () => navigation.navigate('LoginScreen'),
    },
    {
      label: 'Home / Tabs',
      navigate: () => navigation.navigate('MainTabs'),
    },
    {
      label: 'Home (stack)',
      navigate: () => navigation.navigate('HomeScreen'),
    },
    {
      label: 'Flats',
      navigate: () => navigation.navigate('MainTabs', { screen: 'Flats' }),
    },
    {
      label: 'Profile',
      navigate: () => navigation.navigate('MainTabs', { screen: 'Profile' }),
    },
    {
      label: 'Property Selection',
      navigate: () => {
        ensureMockSession();
        navigation.navigate('PropertySelectionScreen');
      },
    },
    {
      label: 'Sensor Type',
      navigate: () => {
        ensureMockSession();
        navigation.navigate('Sensor Type');
      },
    },
    {
      label: 'Nearby Devices',
      navigate: () => {
        ensureMockSession();
        navigation.navigate('NearByScreen', { sensorType: UI_MODE_MOCK_SENSOR });
      },
    },
    {
      label: 'Device Details',
      navigate: () => {
        ensureMockSession();
        navigation.navigate('DeviceDetails', {
          device: UI_MODE_MOCK_DEVICE,
          sensorType: UI_MODE_MOCK_SENSOR,
        });
      },
    },
    {
      label: 'Success',
      navigate: () => {
        ensureMockSession();
        navigation.navigate('SuccessScreen', {
          device: UI_MODE_MOCK_DEVICE,
          sensorType: UI_MODE_MOCK_SENSOR,
        });
      },
    },
  ];

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <Text style={styles.heading}>Jump to any screen</Text>
      <View style={styles.grid}>
        {screens.map((screen) => (
          <TouchableOpacity
            key={screen.label}
            style={styles.chip}
            activeOpacity={0.8}
            onPress={screen.navigate}
          >
            <Text style={styles.chipText}>{screen.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  wrapCompact: {
    width: 260,
    alignSelf: 'flex-end',
    marginBottom: 8,
    maxHeight: 220,
  },
  heading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
