/**
 * Main Tab Navigator
 * Bottom tab navigation for main app - Maps & Education Model
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/main/HomeScreen';
import MapsScreen from '../screens/main/MapsScreen';
import LocationDetailScreen from '../screens/main/LocationDetailScreen';
import TutorialScreen from '../screens/main/TutorialScreen';
import TutorialDetailScreen from '../screens/main/TutorialDetailScreen';
import AddReviewScreen from '../screens/main/AddReviewScreen';
import HistoryScreen from '../screens/main/HistoryScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Maps Stack
const MapsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="MapsList" 
      component={MapsScreen}
      options={{ 
        title: 'Find Collection Centers',
        headerShown: true,
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
    <Stack.Screen 
      name="LocationDetail" 
      component={LocationDetailScreen}
      options={{ 
        title: 'Location Details',
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
    <Stack.Screen 
      name="AddReview" 
      component={AddReviewScreen}
      options={{ 
        title: 'Add Review',
        headerShown: false
      }}
    />
  </Stack.Navigator>
);

// Tutorial Stack
const TutorialStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="TutorialsList" 
      component={TutorialScreen}
      options={{ 
        title: 'Educational Content',
        headerShown: true,
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
    <Stack.Screen 
      name="TutorialDetail" 
      component={TutorialDetailScreen}
      options={{ 
        title: 'Tutorial',
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
  </Stack.Navigator>
);

// History Stack
const HistoryStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="HistoryList" 
      component={HistoryScreen}
      options={{ 
        title: 'History',
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ProfileMain" 
      component={ProfileScreen}
      options={{ 
        title: 'Profile',
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
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
          } else if (route.name === 'Maps') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Tutorial') {
            iconName = focused ? 'book' : 'book-outline';
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
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Maps" 
        component={MapsStack}
        options={{ tabBarLabel: 'Collection Centers' }}
      />
      <Tab.Screen 
        name="Tutorial" 
        component={TutorialStack}
        options={{ tabBarLabel: 'Learn' }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryStack}
        options={{ tabBarLabel: 'History' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
