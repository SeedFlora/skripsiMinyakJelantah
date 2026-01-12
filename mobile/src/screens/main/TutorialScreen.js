/**
 * Tutorial Screen - Educational Content about Waste Oil Recycling
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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const CATEGORIES = [
  { id: 'environment', label: '🌍 Environment', color: '#4CAF50' },
  { id: 'storage', label: '🏠 Storage', color: '#2196F3' },
  { id: 'cooking', label: '🍳 Cooking', color: '#FF9800' },
  { id: 'recycling', label: '♻️ Recycling', color: '#9C27B0' },
  { id: 'health', label: '❤️ Health', color: '#F44336' },
];

const TutorialScreen = ({ navigation }) => {
  const [tutorials, setTutorials] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('environment');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTutorials();
  }, [selectedCategory]);

  const loadTutorials = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tutorials/category/${selectedCategory}`);
      setTutorials(response.data.data);
    } catch (error) {
      console.error('Error loading tutorials:', error);
    } finally {
      setLoading(false);
    }
  };

  const TutorialCard = ({ item }) => (
    <TouchableOpacity
      style={styles.tutorialCard}
      onPress={() =>
        navigation.navigate('TutorialDetail', { tutorialId: item.id })
      }
    >
      {item.image_url && (
        <Image
          source={{ uri: item.image_url }}
          style={styles.tutorialImage}
        />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.tutorialTitle}>{item.title}</Text>
        <Text style={styles.tutorialDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.readTime}>⏱️ {item.read_time} min read</Text>
          <Ionicons name="arrow-forward" size={16} color="#4CAF50" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 Learn About Recycling</Text>
        <Text style={styles.headerSubtitle}>
          Edukasi lengkap tentang daur ulang minyak jelantah
        </Text>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryButton,
              selectedCategory === cat.id && [
                styles.categoryButtonActive,
                { backgroundColor: cat.color },
              ],
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat.id && styles.categoryTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tutorials List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : tutorials.length > 0 ? (
        <FlatList
          data={tutorials}
          renderItem={({ item }) => <TutorialCard item={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No tutorials yet</Text>
        </View>
      )}
    </View>
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
  categoriesContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: '#fff',
  },
  categoryButtonActive: {
    borderColor: 'transparent',
  },
  categoryText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 12,
  },
  categoryTextActive: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 10,
  },
  tutorialCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    marginHorizontal: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  tutorialImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#e0e0e0',
  },
  cardContent: {
    padding: 15,
  },
  tutorialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tutorialDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readTime: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    color: '#ccc',
    fontSize: 14,
  },
});

export default TutorialScreen;
