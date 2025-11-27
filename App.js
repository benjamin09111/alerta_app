import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Helper to generate a random German-style phone number
const generateRandomGermanNumber = () => {
  const prefix = '+49';
  const mobilePrefix = Math.floor(Math.random() * (179 - 150 + 1) + 150); // 150-179
  const number = Math.floor(Math.random() * 9000000) + 1000000;
  return `${prefix} ${mobilePrefix} ${number}`;
};

// Helper to generate a mock Device ID
const MOCK_DEVICE_ID = 'ALERTA-' + Math.random().toString(36).substr(2, 9).toUpperCase();

export default function App() {
  const [emergencyNumber, setEmergencyNumber] = useState(generateRandomGermanNumber());
  const [modalVisible, setModalVisible] = useState(false);
  const [tempNumber, setTempNumber] = useState('');

  const handleOpenModal = () => {
    setTempNumber(emergencyNumber);
    setModalVisible(true);
  };

  const handleSaveNumber = () => {
    setEmergencyNumber(tempNumber);
    setModalVisible(false);
  };

  const handlePlaceholderPress = (feature) => {
    Alert.alert('Coming Soon', `${feature} is not implemented in this prototype.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alerta</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>CONFIGURATION</Text>

        {/* Device ID Item */}
        <View style={styles.itemContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="hardware-chip-outline" size={24} color="#A0A0A0" />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemLabel}>Device ID</Text>
            <Text style={styles.itemValue}>{MOCK_DEVICE_ID}</Text>
          </View>
        </View>

        {/* Emergency Number Item (Editable) */}
        <TouchableOpacity style={styles.itemContainer} onPress={handleOpenModal}>
          <View style={styles.iconContainer}>
            <Ionicons name="call-outline" size={24} color="#FF4B4B" />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemLabel}>Emergency Number</Text>
            <Text style={styles.itemValue}>{emergencyNumber}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#555" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>GENERAL</Text>

        {/* Help Item */}
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => handlePlaceholderPress('Help')}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="help-circle-outline" size={24} color="#4B9FFF" />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemLabel}>Help</Text>
            <Text style={styles.itemSubtext}>Get support and documentation</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#555" />
        </TouchableOpacity>

        {/* Advanced Configuration Item */}
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => handlePlaceholderPress('Advanced Configuration')}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="settings-outline" size={24} color="#A0A0A0" />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemLabel}>Advanced Configuration</Text>
            <Text style={styles.itemSubtext}>Developer options and logs</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#555" />
        </TouchableOpacity>

      </ScrollView>

      {/* Edit Number Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Emergency Number</Text>
            <Text style={styles.modalSubtitle}>Enter the phone number to dial in case of emergency.</Text>

            <TextInput
              style={styles.input}
              value={tempNumber}
              onChangeText={setTempNumber}
              keyboardType="phone-pad"
              placeholder="+49 ..."
              placeholderTextColor="#666"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveNumber}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark premium background
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    backgroundColor: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 5,
    letterSpacing: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 14,
    color: '#A0A0A0',
    fontFamily: 'monospace',
  },
  itemSubtext: {
    fontSize: 13,
    color: '#666',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#252525',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1A1A1A',
    color: '#FFF',
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  saveButton: {
    backgroundColor: '#FF4B4B',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
