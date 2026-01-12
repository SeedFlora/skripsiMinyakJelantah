/**
 * Containers Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/api';

const ContainersScreen = ({ navigation }) => {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadContainers();
    }, [])
  );

  const loadContainers = async () => {
    try {
      setLoading(true);
      const response = await api.get(ENDPOINTS.CONTAINERS);
      setContainers(response.data.containers);
    } catch (error) {
      console.error('Error loading containers:', error);
      Alert.alert('Error', 'Gagal memuat container');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadContainers();
    setRefreshing(false);
  };

  const handleDelete = async (id) => {
    Alert.alert('Hapus Container', 'Yakin ingin menghapus container ini?', [
      { text: 'Batal', onPress: () => {} },
      {
        text: 'Hapus',
        onPress: async () => {
          try {
            await api.delete(`${ENDPOINTS.CONTAINERS}/${id}`);
            loadContainers();
            Alert.alert('Sukses', 'Container berhasil dihapus');
          } catch (error) {
            Alert.alert('Error', 'Gagal menghapus container');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const renderContainer = ({ item }) => (
    <TouchableOpacity
      style={styles.containerCard}
      onPress={() =>
        navigation.navigate('ContainerDetail', { containerId: item.id })
      }
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.containerName}>{item.name}</Text>
          <Text style={styles.deviceId}>ID: {item.device_id}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.is_online ? styles.statusOnline : styles.statusOffline,
          ]}
        >
          <Text style={styles.statusText}>
            {item.is_online ? '🟢 Online' : '🔴 Offline'}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Volume:</Text>
          <Text style={styles.value}>{item.current_volume.toFixed(1)} L</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Suhu:</Text>
          <Text style={styles.value}>{item.current_temperature.toFixed(1)}°C</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Kapasitas:</Text>
          <Text style={styles.value}>{item.capacity} L</Text>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${item.current_percentage}%`,
                  backgroundColor:
                    item.current_percentage < 50
                      ? '#4CAF50'
                      : item.current_percentage < 80
                      ? '#FF9800'
                      : '#FF5252',
                },
              ]}
            />
          </View>
          <Text style={styles.percentText}>{item.current_percentage.toFixed(0)}%</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() =>
            navigation.navigate('PickupRequest', { containerId: item.id })
          }
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
          <Text style={styles.actionText}>Request Pickup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Container Saya</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddContainer')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {containers.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="cube-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Belum ada container</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('AddContainer')}
          >
            <Text style={styles.emptyButtonText}>Tambah Container Sekarang</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={containers}
          renderItem={renderContainer}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
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
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addBtn: {
    backgroundColor: '#4CAF50',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  containerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  containerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceId: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusOnline: {
    backgroundColor: '#E8F5E9',
  },
  statusOffline: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardBody: {
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  progressSection: {
    marginTop: 12,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  cardFooter: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  deleteBtn: {
    flex: 0,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 20,
  },
  emptyButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ContainersScreen;
