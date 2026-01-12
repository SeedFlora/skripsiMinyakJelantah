/**
 * Add Review/Rating Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';

const AddReviewScreen = ({ route, navigation }) => {
  const { locationId, onReviewAdded } = route.params;
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.cancelled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (reviewText.trim() === '') {
      Alert.alert('Error', 'Please write a review');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('location_id', locationId);
      formData.append('rating', rating);
      formData.append('review_text', reviewText);

      if (selectedImage) {
        const filename = selectedImage.uri.split('/').pop();
        formData.append('image', {
          uri: selectedImage.uri,
          name: filename,
          type: 'image/jpeg',
        });
      }

      await api.post('/reviews', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Review submitted successfully!');
      onReviewAdded();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review');
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  const StarRating = () => (
    <View style={styles.starRatingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => setRating(star)}
          style={styles.starButton}
        >
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={40}
            color={star <= rating ? '#FFB800' : '#ddd'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Share Your Experience</Text>
        <Text style={styles.headerSubtitle}>
          Help other users by sharing your feedback
        </Text>
      </View>

      {/* Rating Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How would you rate this location?</Text>
        <StarRating />
        <Text style={styles.ratingText}>
          {rating > 0 ? `${rating} / 5 Stars` : 'Select rating'}
        </Text>
      </View>

      {/* Review Text */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Review</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Share your experience with this waste oil collection center..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={5}
          value={reviewText}
          onChangeText={setReviewText}
          editable={!loading}
        />
        <Text style={styles.charCount}>
          {reviewText.length} / 500 characters
        </Text>
      </View>

      {/* Photo Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Photo (Optional)</Text>
        <TouchableOpacity
          style={styles.photoButton}
          onPress={pickImage}
          disabled={loading}
        >
          <Ionicons name="camera" size={24} color="#4CAF50" />
          <Text style={styles.photoButtonText}>
            {selectedImage ? 'Change Photo' : 'Select Photo'}
          </Text>
        </TouchableOpacity>

        {selectedImage && (
          <View style={styles.imagePreview}>
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.previewImage}
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Submit Review</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  starRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  starButton: {
    marginHorizontal: 10,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 120,
  },
  charCount: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 30,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  photoButtonText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  imagePreview: {
    marginTop: 15,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 5,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddReviewScreen;
