import React from 'react'
import LiveMarketScreen from './src/screens/LiveMarketScreen'
import BluetoothDevices from './src/screens/BluetoothDevices'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import DeviceDetails from './src/screens/DeviceDetails'

const Stack = createNativeStackNavigator()

const App = () => {
  // return <BluetoothDevices/>
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='BluetoothDeviceScan'
          component={BluetoothDevices}
          options={{ title: 'BLE Scanner' }} />
        <Stack.Screen
          name='DeviceDetails'
          component={DeviceDetails}
          options={{ title: 'Device Details' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App