import React from 'react'
import BluetoothDevices from './src/screens/BluetoothDevices'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import DeviceDetails from './src/screens/DeviceDetails'
import ProfileScreen from './src/screens/ProfileScreen'
import SensorTypeScreen from './src/screens/SensorTypeScreen'
import NearByDeviceScreen from './src/screens/NearByDeviceScreen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import LoginScreen from './src/screens/LoginScreen'
import PropertySelectionScreen from './src/screens/PropertySelectionScreen'

const Stack = createNativeStackNavigator()

const App = () => {
  // return <ProfileScreen/>
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name='LoginScreen'
            component={LoginScreen} />
            <Stack.Screen name='PropertySelectionScreen'
            component={PropertySelectionScreen} /> */}
          <Stack.Screen name='Sensor Type'
            component={SensorTypeScreen} />
          <Stack.Screen
            name='NearByScreen'
            component={NearByDeviceScreen}
          />
          <Stack.Screen name='BluetoothDeviceScan'
            component={BluetoothDevices}
            options={{ title: 'BLE Scanner' }} />
          <Stack.Screen
            name='DeviceDetails'
            component={DeviceDetails}
            options={{ title: 'Device Details' }} />
          <Stack.Screen
            name='ProfileScreen'
            component={ProfileScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App