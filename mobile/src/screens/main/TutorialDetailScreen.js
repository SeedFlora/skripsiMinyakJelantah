/**
 * Tutorial Detail Screen - Display full tutorial content with video
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import api from '../../services/api';

const TutorialDetailScreen = ({ route }) => {
  const { tutorialId } = route.params;
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    loadTutorialDetail();
  }, [tutorialId]);

  const loadTutorialDetail = async () => {
    try {
      const response = await api.get(`/tutorials/${tutorialId}`);
      setTutorial(response.data.data);
    } catch (error) {
      console.error('Error loading tutorial:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!tutorial) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Tutorial not found</Text>
      </View>
    );
  }

  const getCategoryColor = (category) => {
    const colors = {
      environment: '#4CAF50',
      storage: '#2196F3',
      cooking: '#FF9800',
      recycling: '#9C27B0',
      health: '#F44336',
    };
    return colors[category] || '#4CAF50';
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      environment: '🌍',
      storage: '🏠',
      cooking: '🍳',
      recycling: '♻️',
      health: '❤️',
    };
    return emojis[category] || '📚';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Category Badge */}
      {tutorial.image_url && (
        <Image
          source={{ uri: tutorial.image_url }}
          style={styles.heroImage}
        />
      )}

      <View style={styles.headerContainer}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(tutorial.category) },
          ]}
        >
          <Text style={styles.categoryBadgeText}>
            {getCategoryEmoji(tutorial.category)} {tutorial.category.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.title}>{tutorial.title}</Text>

        <View style={styles.metaInfo}>
          <Text style={styles.readTime}>⏱️ {tutorial.read_time} min read</Text>
        </View>
      </View>

      {/* Video Section */}
      {tutorial.video_url && (
        <View style={styles.videoSection}>
          <TouchableOpacity
            style={styles.videoThumbnail}
            onPress={() => setShowVideo(true)}
          >
            <Ionicons name="play-circle" size={60} color="#4CAF50" />
            <Text style={styles.playVideoText}>Watch Video Tutorial</Text>
          </TouchableOpacity>

          {showVideo && (
            <View style={styles.videoContainer}>
              <WebView
                style={styles.webView}
                source={{ uri: tutorial.video_url }}
                allowsFullscreenVideo
              />
              <TouchableOpacity
                style={styles.closeVideoButton}
                onPress={() => setShowVideo(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Content */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>Content</Text>

        {tutorial.description && (
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{tutorial.description}</Text>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.contentText}>{tutorial.content}</Text>
        </View>
      </View>

      {/* Share & More Actions */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // Share functionality
            console.log('Share tutorial');
          }}
        >
          <Ionicons name="share-social" size={20} color="#4CAF50" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // Like/bookmark functionality
            console.log('Bookmark tutorial');
          }}
        >
          <Ionicons name="bookmark-outline" size={20} color="#4CAF50" />
          <Text style={styles.actionText}>Bookmark</Text>
        </TouchableOpacity>
      </View>

      {/* Related Resources */}
      <View style={styles.resourcesSection}>
        <Text style={styles.sectionTitle}>More Resources</Text>
        <TouchableOpacity style={styles.resourceLink}>
          <Ionicons name="link" size={20} color="#4CAF50" />
          <Text style={styles.resourceLinkText}>
            Learn More on Official Website
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Footer Spacing */}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  heroImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#e0e0e0',
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    lineHeight: 32,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTime: {
    fontSize: 12,
    color: '#999',
  },
  videoSection: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  videoThumbnail: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playVideoText: {
    marginTop: 10,
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  videoContainer: {
    height: 250,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  closeVideoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
  },
  contentSection: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  descriptionBox: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    marginBottom: 20,
    borderRadius: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  content: {
    marginTop: 10,
  },
  contentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 15,
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 2,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  resourcesSection: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  resourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  resourceLinkText: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default TutorialDetailScreen;
