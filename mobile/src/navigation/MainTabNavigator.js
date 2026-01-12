/**
 * Main Tab Navigator
 * Bottom tab navigation for main app
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/main/HomeScreen';
import ContainersScreen from '../screens/main/ContainersScreen';
import ContainerDetailScreen from '../screens/main/ContainerDetailScreen';
import AddContainerScreen from '../screens/main/AddContainerScreen';
import HistoryScreen from '../screens/main/HistoryScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import PickupRequestScreen from '../screens/main/PickupRequestScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Container Stack
const ContainerStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ContainersList" 
      component={ContainersScreen}
      options={{ title: 'Container Saya' }}
    />
    <Stack.Screen 
      name="ContainerDetail" 
      component={ContainerDetailScreen}
      options={{ title: 'Detail Container' }}
    />
    <Stack.Screen 
      name="AddContainer" 
      component={AddContainerScreen}
      options={{ title: 'Tambah Container' }}
    />
    <Stack.Screen 
      name="PickupRequest" 
      component={PickupRequestScreen}
      options={{ title: 'Request Pickup' }}
    />
  </Stack.Navigator>
);

// History Stack
const HistoryStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="HistoryList" 
      component={HistoryScreen}
      options={{ title: 'Riwayat Transaksi' }}
    />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ProfileMain" 
      component={ProfileScreen}
      options={{ title: 'Profil Saya' }}
    />
  </Stack.Navigator>
);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Containers') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Beranda' }}
      />
      <Tab.Screen 
        name="Containers" 
        component={ContainerStack}
        options={{ tabBarLabel: 'Container' }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryStack}
        options={{ tabBarLabel: 'Riwayat' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
