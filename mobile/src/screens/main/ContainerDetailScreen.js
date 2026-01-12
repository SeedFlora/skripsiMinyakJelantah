/**
 * Container Detail Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/api';

const ContainerDetailScreen = ({ route, navigation }) => {
  const { containerId } = route.params;
  const [container, setContainer] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [containerRes, historyRes] = await Promise.all([
        api.get(`${ENDPOINTS.CONTAINERS}/${containerId}`),
        api.get(ENDPOINTS.CONTAINER_HISTORY(containerId) + '?limit=10'),
      ]);

      setContainer(containerRes.data.container);
      setHistory(historyRes.data.history);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (!container) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: history.slice(0, 7).reverse().map((_, i) => `${i}h`),
    datasets: [
      {
        data: history.slice(0, 7).reverse().map(h => h.percentage),
      },
    ],
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#4CAF50" />
        </TouchableOpacity>
        <Text style={styles.title}>{container.name}</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusLeft}>
          <View
            style={[
              styles.statusIndicator,
              container.is_online ? styles.online : styles.offline,
            ]}
          />
          <View>
            <Text style={styles.statusTitle}>
              {container.is_online ? 'Online' : 'Offline'}
            </Text>
            {container.last_seen && (
              <Text style={styles.statusTime}>
                Last: {new Date(container.last_seen).toLocaleTimeString('id-ID')}
              </Text>
            )}
          </View>
        </View>
        <Text style={styles.temperature}>{container.current_temperature.toFixed(1)}°C</Text>
      </View>

      {/* Volume Display */}
      <View style={styles.volumeSection}>
        <View style={styles.volumeCard}>
          <Text style={styles.volumeLabel}>Volume</Text>
          <Text style={styles.volumeValue}>{container.current_volume.toFixed(1)} L</Text>
          <Text style={styles.volumeMax}>dari {container.capacity} L</Text>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${container.current_percentage}%`,
                  backgroundColor:
                    container.current_percentage < 50
                      ? '#4CAF50'
                      : container.current_percentage < 80
                      ? '#FF9800'
                      : '#FF5252',
                },
              ]}
            />
          </View>
          <Text style={styles.percentText}>{container.current_percentage.toFixed(0)}%</Text>
        </View>
      </View>

      {/* Container Info */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informasi Container</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Device ID</Text>
            <Text style={styles.infoValue}>{container.device_id}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Height</Text>
            <Text style={styles.infoValue}>{container.height} cm</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Diameter</Text>
            <Text style={styles.infoValue}>{container.diameter} cm</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Alert Threshold</Text>
            <Text style={styles.infoValue}>{container.alert_threshold}%</Text>
          </View>
        </View>
      </View>

      {/* Location */}
      {container.latitude && container.longitude && (
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>📍 Lokasi</Text>
          <View style={styles.locationCard}>
            <Text style={styles.locationText}>{container.address}</Text>
            <Text style={styles.coordinates}>
              {container.latitude.toFixed(4)}, {container.longitude.toFixed(4)}
            </Text>
          </View>
        </View>
      )}

      {/* Chart */}
      {history.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>📊 Grafik Level</Text>
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 40}
            height={200}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: () => '#4CAF50',
              labelColor: () => '#999',
            }}
            style={styles.chart}
          />
        </View>
      )}

      {/* History */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>📋 Riwayat Sensor</Text>
        {history.slice(0, 5).map((item, idx) => (
          <View key={idx} style={styles.historyItem}>
            <View style={styles.historyTime}>
              <Text style={styles.historyTimeText}>
                {new Date(item.recorded_at).toLocaleTimeString('id-ID')}
              </Text>
            </View>
            <View style={styles.historyData}>
              <Text style={styles.historyDataText}>
                {item.volume.toFixed(1)}L • {item.percentage.toFixed(0)}% • {item.temperature?.toFixed(1) || 0}°C
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate('PickupRequest', { containerId: container.id })
          }
        >
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.actionButtonText}>Request Pickup</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="settings-outline" size={24} color="#2196F3" />
          <Text style={styles.actionButtonText}>Pengaturan</Text>
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
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusCard: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  online: {
    backgroundColor: '#4CAF50',
  },
  offline: {
    backgroundColor: '#FF5252',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  volumeSection: {
    margin: 15,
    gap: 15,
  },
  volumeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  volumeLabel: {
    fontSize: 14,
    color: '#666',
  },
  volumeValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
  volumeMax: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  progressSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  percentText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'right',
  },
  infoSection: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoGrid: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
  },
  infoItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  locationSection: {
    margin: 15,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  coordinates: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  chartSection: {
    margin: 15,
  },
  chart: {
    marginVertical: 12,
    borderRadius: 12,
  },
  historySection: {
    margin: 15,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 12,
  },
  historyTime: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  historyTimeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  historyData: {
    flex: 1,
    justifyContent: 'center',
  },
  historyDataText: {
    fontSize: 13,
    color: '#666',
  },
  actionSection: {
    margin: 15,
    marginBottom: 30,
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default ContainerDetailScreen;
