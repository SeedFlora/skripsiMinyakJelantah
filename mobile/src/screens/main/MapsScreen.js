/**
 * Maps Screen - Find Waste Oil Collection Centers
 * Shows Google Maps with collection center markers
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import api from '../../services/api';

const { width, height } = Dimensions.get('window');

const MapsScreen = ({ navigation }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    loadLocations();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      // Request location permission (Android)
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
      }

      // Get current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => console.log(error)
      );
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  const loadLocations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/locations');
      setLocations(response.data.data);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyLocations = async () => {
    if (!userLocation) return;

    try {
      const response = await api.get('/locations/nearby', {
        params: {
          lat: userLocation.latitude,
          lng: userLocation.longitude,
          radius: 10, // 10 km
        },
      });
      setLocations(response.data.data);
    } catch (error) {
      console.error('Error loading nearby locations:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Maps */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={
          userLocation
            ? {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : {
                latitude: -6.2088,
                longitude: 106.8456,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
        }
      >
        {/* User marker */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="#4CAF50"
          />
        )}

        {/* Location markers */}
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.name}
            description={location.address}
            onPress={() => setSelectedLocation(location)}
          />
        ))}
      </MapView>

      {/* Selected location info card */}
      {selectedLocation && (
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{selectedLocation.name}</Text>
            <TouchableOpacity onPress={() => setSelectedLocation(null)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.cardText}>
            📍 {selectedLocation.address}
          </Text>
          <Text style={styles.cardText}>
            ⏰ {selectedLocation.opening_hours}
          </Text>
          <Text style={styles.cardText}>
            💰 Rp {selectedLocation.price_per_liter}/liter
          </Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() =>
                navigation.navigate('LocationDetail', {
                  locationId: selectedLocation.id,
                })
              }
            >
              <Text style={styles.buttonText}>Detail</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactButton}
              onPress={() =>
                Linking.openURL(`https://wa.me/${selectedLocation.whatsapp}`)
              }
            >
              <Text style={styles.buttonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Action buttons */}
      <TouchableOpacity
        style={styles.nearbyButton}
        onPress={loadNearbyLocations}
      >
        <Ionicons name="locate" size={24} color="#fff" />
        <Text style={styles.nearbyButtonText}>Nearby</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  detailButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#25D366',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  nearbyButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    elevation: 5,
  },
  nearbyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default MapsScreen;
