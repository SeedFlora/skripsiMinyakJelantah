/**
 * Home Screen
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/api';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, containersRes] = await Promise.all([
        api.get(ENDPOINTS.TRANSACTION_STATS),
        api.get(ENDPOINTS.CONTAINERS),
      ]);

      setStats(statsRes.data.stats);
      setContainers(containersRes.data.containers);
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

  const handleLogout = () => {
    Alert.alert('Keluar', 'Yakin ingin keluar?', [
      { text: 'Batal', onPress: () => {} },
      { text: 'Keluar', onPress: logout, style: 'destructive' },
    ]);
  };

  const activeContainers = containers.filter(c => c.is_online).length;
  const highAlertContainers = containers.filter(
    c => c.current_percentage >= c.alert_threshold
  ).length;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo, {user?.name}! 👋</Text>
          <Text style={styles.subtitle}>Selamat datang di JelantahKu</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="water" size={30} color="#4CAF50" />
          <Text style={styles.statLabel}>Total Volume</Text>
          <Text style={styles.statValue}>
            {stats?.total_volume?.toFixed(1) || 0} L
          </Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="cash" size={30} color="#FF9800" />
          <Text style={styles.statLabel}>Earning</Text>
          <Text style={styles.statValue}>
            Rp {stats?.total_earnings?.toLocaleString() || 0}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="cube" size={30} color="#2196F3" />
          <Text style={styles.statLabel}>Container</Text>
          <Text style={styles.statValue}>{containers.length}</Text>
        </View>
      </View>

      {/* Alerts */}
      {highAlertContainers > 0 && (
        <View style={styles.alertBox}>
          <Ionicons name="warning" size={24} color="#FF5252" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>⚠️ Container Penuh!</Text>
            <Text style={styles.alertText}>
              {highAlertContainers} container mencapai level kritis
            </Text>
          </View>
        </View>
      )}

      {/* Container Status */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Status Container</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Containers')}>
            <Text style={styles.sectionLink}>Lihat Semua →</Text>
          </TouchableOpacity>
        </View>

        {containers.slice(0, 3).map((container) => (
          <TouchableOpacity
            key={container.id}
            style={styles.containerItem}
            onPress={() =>
              navigation.navigate('ContainerDetail', { containerId: container.id })
            }
          >
            <View style={styles.containerInfo}>
              <Text style={styles.containerName}>{container.name}</Text>
              <Text style={styles.containerStatus}>
                {container.is_online ? '🟢 Online' : '🔴 Offline'}
              </Text>
            </View>
            <View style={styles.containerLevel}>
              <Text style={styles.volumeText}>{container.current_volume.toFixed(1)}L</Text>
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
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddContainer')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
          <Text style={styles.actionButtonText}>Tambah Container</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('History')}
        >
          <Ionicons name="list-outline" size={24} color="#4CAF50" />
          <Text style={styles.actionButtonText}>Riwayat Transaksi</Text>
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
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  alertBox: {
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5252',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C62828',
  },
  alertText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 15,
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
  sectionLink: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  containerItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerInfo: {
    flex: 1,
  },
  containerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  containerStatus: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  containerLevel: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  volumeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressBar: {
    width: 60,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  percentText: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  actionSection: {
    padding: 15,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
});

export default HomeScreen;
