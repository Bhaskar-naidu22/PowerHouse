import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Icon } from '../components/IconComponent';
import FlatStatus from '../screens/FlatStatus';
import { FontFamily } from '../theme/fonts';

const Tab = createBottomTabNavigator();

/** Icon + label area (above system nav / home indicator). */
const TAB_BAR_CONTENT_HEIGHT = 52;

export default function MainTabNavigator() {
    const insets = useSafeAreaInsets();
    // Keep icons clear of gesture bars / 3-button nav
    const bottomInset = Math.max(insets.bottom, 8);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#3B5BDB',
                tabBarInactiveTintColor: '#3B5BDB',
                tabBarLabelStyle: {
                    fontFamily: FontFamily.medium,
                    fontWeight: 'normal',
                    marginTop: 2,
                },
                tabBarStyle: {
                    paddingTop: 6,
                    paddingBottom: bottomInset,
                    height: TAB_BAR_CONTENT_HEIGHT + 6 + bottomInset,
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: '#E5E7EB',
                    backgroundColor: '#FFFFFF',
                    elevation: 0,
                    shadowOpacity: 0,
                    shadowRadius: 0,
                    shadowOffset: { width: 0, height: 0 },
                },
                tabBarItemStyle: {
                    paddingVertical: 0,
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName: string = '';

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Profile') {
                        iconName = 'profile';
                    } else if (route.name === 'Flats') {
                        iconName = 'flats';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Flats" component={FlatStatus} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
