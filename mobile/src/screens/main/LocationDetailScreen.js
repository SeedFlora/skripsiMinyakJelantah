/**
 * Location Detail Screen - View full info and reviews for collection centers
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import api from '../../services/api';

const LocationDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const [locationDetail, setLocationDetail] = useState(location);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocationDetail();
    loadReviews();
  }, [location.id]);

  const loadLocationDetail = async () => {
    try {
      const response = await api.get(`/locations/${location.id}`);
      setLocationDetail(response.data.data);
    } catch (error) {
      console.error('Error loading location detail:', error);
    }
  };

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/locations/${location.id}/reviews`);
      setReviews(response.data.data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (locationDetail.phone) {
      Linking.openURL(`tel:${locationDetail.phone}`);
    }
  };

  const handleWhatsApp = () => {
    if (locationDetail.whatsapp) {
      const message = `Halo! Saya ingin tahu lebih lanjut tentang penampungan minyak jelantah di ${locationDetail.name}`;
      const encodedMessage = encodeURIComponent(message);
      const phoneNumber = locationDetail.whatsapp.replace(/\D/g, '');
      Linking.openURL(`https://wa.me/${phoneNumber}?text=${encodedMessage}`);
    }
  };

  const handleDirections = () => {
    if (locationDetail.latitude && locationDetail.longitude) {
      const url = `https://maps.google.com/?q=${locationDetail.latitude},${locationDetail.longitude}`;
      Linking.openURL(url);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i < Math.round(rating) ? 'star' : 'star-outline'}
          size={16}
          color={i < Math.round(rating) ? '#FFB800' : '#ccc'}
        />
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const ReviewCard = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewAuthor}>{item.user_name}</Text>
        <Text style={styles.reviewDate}>
          {new Date(item.created_at).toLocaleDateString('id-ID')}
        </Text>
      </View>
      {renderStars(item.rating)}
      <Text style={styles.reviewText}>{item.review_text}</Text>
      {item.image_url && (
        <Image
          source={{ uri: item.image_url }}
          style={styles.reviewImage}
        />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: locationDetail.latitude,
          longitude: locationDetail.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: locationDetail.latitude,
            longitude: locationDetail.longitude,
          }}
          title={locationDetail.name}
        />
      </MapView>

      {/* Location Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.locationName}>{locationDetail.name}</Text>

        {/* Rating */}
        <View style={styles.ratingSection}>
          {renderStars(locationDetail.average_rating || 0)}
          <Text style={styles.ratingText}>
            {locationDetail.average_rating?.toFixed(1) || 'N/A'} (
            {locationDetail.reviews_count || 0} reviews)
          </Text>
        </View>

        {/* Address */}
        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color="#4CAF50" />
          <Text style={styles.infoText}>{locationDetail.address}</Text>
        </View>

        {/* Hours */}
        <View style={styles.infoRow}>
          <Ionicons name="time" size={20} color="#4CAF50" />
          <Text style={styles.infoText}>{locationDetail.opening_hours}</Text>
        </View>

        {/* Price */}
        <View style={styles.infoRow}>
          <Ionicons name="pricetag" size={20} color="#4CAF50" />
          <Text style={styles.infoText}>
            Rp {locationDetail.price_per_liter?.toLocaleString('id-ID')}/liter
          </Text>
        </View>

        {/* Certification */}
        {locationDetail.certification && (
          <View style={styles.infoRow}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>{locationDetail.certification}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button} onPress={handleCall}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleWhatsApp}>
            <Ionicons name="logo-whatsapp" size={20} color="#fff" />
            <Text style={styles.buttonText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleDirections}>
            <Ionicons name="map" size={20} color="#fff" />
            <Text style={styles.buttonText}>Directions</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Reviews Section */}
      <View style={styles.reviewsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddReview', {
                locationId: locationDetail.id,
                onReviewAdded: loadReviews,
              })
            }
          >
            <Ionicons name="add-circle" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : reviews.length > 0 ? (
          <FlatList
            data={reviews}
            renderItem={({ item }) => <ReviewCard item={item} />}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.noReviews}>No reviews yet. Be the first!</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    width: '100%',
    height: 250,
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  locationName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  reviewsSection: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 15,
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 14,
  },
  reviewDate: {
    color: '#999',
    fontSize: 12,
  },
  reviewText: {
    color: '#666',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
    marginTop: 8,
  },
  reviewImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 10,
  },
  noReviews: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginVertical: 20,
  },
});

export default LocationDetailScreen;
