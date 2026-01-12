/**
 * Add Container Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/api';

const AddContainerScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    device_id: '',
    name: '',
    capacity: '20',
    height: '40',
    diameter: '25',
    address: '',
    alert_threshold: '80',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate
    if (!formData.device_id || !formData.name) {
      Alert.alert('Error', 'Device ID dan Nama harus diisi');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(ENDPOINTS.CONTAINERS, {
        device_id: formData.device_id,
        name: formData.name,
        capacity: parseFloat(formData.capacity),
        height: parseFloat(formData.height),
        diameter: parseFloat(formData.diameter),
        address: formData.address,
        alert_threshold: parseFloat(formData.alert_threshold),
      });

      Alert.alert('Sukses', 'Container berhasil ditambahkan');
      navigation.goBack();
    } catch (error) {
      const message = error.response?.data?.error || 'Gagal menambahkan container';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#4CAF50" />
          </TouchableOpacity>
          <Text style={styles.title}>Tambah Container</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Instructions */}
        <View style={styles.instructionBox}>
          <Ionicons name="information-circle-outline" size={20} color="#2196F3" />
          <Text style={styles.instructionText}>
            Device ID harus sesuai dengan ID unik di ESP32 device Anda
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Device ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="ESP32_001 (misal)"
            value={formData.device_id}
            onChangeText={(text) => handleChange('device_id', text)}
            editable={!loading}
          />

          <Text style={styles.label}>Nama Container *</Text>
          <TextInput
            style={styles.input}
            placeholder="Warung Makan, Rumah Sakit, etc"
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
            editable={!loading}
          />

          <Text style={styles.label}>Kapasitas (L)</Text>
          <TextInput
            style={styles.input}
            placeholder="20"
            value={formData.capacity}
            onChangeText={(text) => handleChange('capacity', text)}
            keyboardType="decimal-pad"
            editable={!loading}
          />

          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Tinggi (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="40"
                value={formData.height}
                onChangeText={(text) => handleChange('height', text)}
                keyboardType="decimal-pad"
                editable={!loading}
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Diameter (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="25"
                value={formData.diameter}
                onChangeText={(text) => handleChange('diameter', text)}
                keyboardType="decimal-pad"
                editable={!loading}
              />
            </View>
          </View>

          <Text style={styles.label}>Alamat</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Jl. Contoh No. 123, Kota"
            value={formData.address}
            onChangeText={(text) => handleChange('address', text)}
            multiline
            numberOfLines={3}
            editable={!loading}
          />

          <Text style={styles.label}>Alert Threshold (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="80"
            value={formData.alert_threshold}
            onChangeText={(text) => handleChange('alert_threshold', text)}
            keyboardType="decimal-pad"
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Memproses...' : 'Tambah Container'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Tips Setup ESP32:</Text>
          <Text style={styles.tipText}>
            1. Dapatkan Device ID dari serial output ESP32{'\n'}
            2. Pastikan ESP32 sudah terhubung ke WiFi{'\n'}
            3. Catat ID unik sebelum menambahkan ke aplikasi
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  instructionBox: {
    margin: 15,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 13,
    color: '#1565C0',
  },
  formSection: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipsSection: {
    margin: 15,
    backgroundColor: '#FFF9C4',
    borderRadius: 10,
    padding: 15,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F57F17',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
});

export default AddContainerScreen;
