import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../components/IconComponent';
import FlatStatus from '../screens/FlatStatus';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string = '';

                    if (route.name === 'Home') {
                        // Outlined variant when inactive, filled variant when active
                        iconName = 'home' ;
                    } else if (route.name === 'Profile') {
                        iconName ='profile';
                    }else if(route.name ==='Flats'){
                        iconName='flats';
                    }

                    // Return the vector icon component cleanly
                    return <Icon name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Flats" component={FlatStatus}/>
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}