import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import DeviceDetails from './src/screens/DeviceDetails';
import SensorTypeScreen from './src/screens/SensorTypeScreen';
import NearByDeviceScreen from './src/screens/NearByDeviceScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import PropertySelectionScreen from './src/screens/PropertySelectionScreen';
import { SessionProvider } from './src/contexts/SessionContexts';
import { UiModeProvider } from './src/contexts/UiModeContext';
import * as Sentry from '@sentry/react-native';
import HomeScreen from './src/screens/HomeScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import SuccessScreen from './src/screens/SuccessScreen';
import SplashScreen from './src/screens/SplashScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  // return <ProfileScreen/>
  return (
    <SafeAreaProvider>
      {/* TEMP: UiModeProvider — remove once UI changes are finished */}
      <UiModeProvider>
        <SessionProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="SplashScreen"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="SplashScreen" component={SplashScreen} />
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen
                name="PropertySelectionScreen"
                component={PropertySelectionScreen}
              />
              
              <Stack.Screen name="Sensor Type" component={SensorTypeScreen} />
              <Stack.Screen name="NearByScreen" component={NearByDeviceScreen} />
              <Stack.Screen
                name="DeviceDetails"
                component={DeviceDetails}
              />
              <Stack.Screen name='MainTabs' component={MainTabNavigator}/>
              <Stack.Screen name='HomeScreen' component={HomeScreen} />
              <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SessionProvider>
      </UiModeProvider>
    </SafeAreaProvider>
  );
};

export default Sentry.wrap(App);
