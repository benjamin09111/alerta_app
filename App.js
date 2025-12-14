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
  Platform,
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
  // State for multiple contacts
  const [contacts, setContacts] = useState([
    { id: '1', name: 'Mom & Dad', number: generateRandomGermanNumber() }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null); // null means adding new
  const [tempName, setTempName] = useState('');
  const [tempNumber, setTempNumber] = useState('');

  // Premium Modal State
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);

  const handleOpenAdd = () => {
    if (contacts.length >= 3) {
      if (Platform.OS === 'web') {
        alert('Limit Reached: You can only have up to 3 emergency contacts.');
      } else {
        Alert.alert('Limit Reached', 'You can only have up to 3 emergency contacts.');
      }
      return;
    }
    setEditingId(null);
    setTempName('');
    setTempNumber('');
    setModalVisible(true);
  };

  const handleOpenEdit = (contact) => {
    setEditingId(contact.id);
    setTempName(contact.name);
    setTempNumber(contact.number);
    setModalVisible(true);
  };

  const handleSaveContact = () => {
    if (!tempName.trim() || !tempNumber.trim()) {
      if (Platform.OS === 'web') {
        alert('Missing Info: Please enter both a name and a phone number.');
      } else {
        Alert.alert('Missing Info', 'Please enter both a name and a phone number.');
      }
      return;
    }

    if (editingId) {
      // Edit existing
      setContacts(prev => prev.map(c =>
        c.id === editingId ? { ...c, name: tempName, number: tempNumber } : c
      ));
    } else {
      // Add new
      const newContact = {
        id: Date.now().toString(),
        name: tempName,
        number: tempNumber,
      };
      setContacts(prev => [...prev, newContact]);
    }
    setModalVisible(false);
  };

  const handleDeleteContact = () => {
    if (editingId) {
      setContacts(prev => prev.filter(c => c.id !== editingId));
      setModalVisible(false);
    }
  };

  const handlePlaceholderPress = (feature) => {
    if (Platform.OS === 'web') {
      alert(`Coming Soon: ${feature} is not implemented in this prototype.`);
    } else {
      Alert.alert('Coming Soon', `${feature} is not implemented in this prototype.`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F4F8" />

      {/* Header - Now more subtle */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alerta</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* User Profile Section - Friendly Touch */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {/* Placeholder for user image */}
            <Text style={styles.profileInitials}>B</Text>
          </View>
          <View>
            <Text style={styles.greetingText}>Hello, Benjamin</Text>
            <Text style={styles.statusText}>You are protected</Text>
          </View>
        </View>

        {/* Premium Banner */}
        <View style={styles.premiumBanner}>
          <View style={styles.premiumTextContent}>
            <View style={styles.premiumTitleRow}>
              <Ionicons name="star" size={20} color="#FFD700" style={{ marginRight: 8 }} />
              <Text style={styles.premiumTitle}>Premium Option</Text>
            </View>
            <Text style={styles.premiumSubtitle}>Get Premium for 5EUR. 24/7 Service.</Text>
          </View>
          <TouchableOpacity
            style={styles.premiumButton}
            onPress={() => setPremiumModalVisible(true)}
          >
            <Text style={styles.premiumButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>YOUR DEVICE</Text>

        {/* Device ID Item */}
        <View style={styles.itemContainer}>
          <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="hardware-chip-outline" size={24} color="#2196F3" />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemLabel}>Device ID</Text>
            <Text style={styles.itemValue}>{MOCK_DEVICE_ID}</Text>
          </View>
        </View>

        <View style={styles.sectionHeaderContainer}>
          <Text style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0 }]}>EMERGENCY CONTACTS ({contacts.length}/3)</Text>
          {contacts.length < 3 && (
            <TouchableOpacity onPress={handleOpenAdd}>
              <Text style={styles.addContactText}>+ Add New</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Emergency Contacts List */}
        {contacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={styles.itemContainer}
            onPress={() => handleOpenEdit(contact)}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="heart-outline" size={24} color="#EF5350" />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemLabel}>Emergency Contact</Text>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.itemValue}>{contact.number}</Text>
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={16} color="#444" />
            </View>
          </TouchableOpacity>
        ))}

        {contacts.length === 0 && (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No contacts added yet.</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleOpenAdd}>
              <Text style={styles.addButtonText}>Add First Contact</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Only show "Add Another" button at bottom if we have contacts but less than max */}
        {contacts.length > 0 && contacts.length < 3 && (
          <TouchableOpacity style={styles.outlineButton} onPress={handleOpenAdd}>
            <Text style={styles.outlineButtonText}>Add Another Contact</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>SETTINGS</Text>

        {/* Help Item */}
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => handlePlaceholderPress('Help')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="help-buoy-outline" size={24} color="#66BB6A" />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemLabel}>Help & Support</Text>
            <Text style={styles.itemSubtext}>Get support and documentation</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        {/* Advanced Configuration Item */}
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => handlePlaceholderPress('Advanced Configuration')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
            <Ionicons name="settings-outline" size={24} color="#AB47BC" />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemLabel}>Advanced</Text>
            <Text style={styles.itemSubtext}>Developer options</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

      </ScrollView>

      {/* Edit/Add Contact Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit Contact' : 'New Contact'}</Text>
            <Text style={styles.modalSubtitle}>Manage your emergency contact details.</Text>

            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={tempName}
              onChangeText={setTempName}
              placeholder="e.g. Mom"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={tempNumber}
              onChangeText={setTempNumber}
              keyboardType="phone-pad"
              placeholder="+49 ..."
              placeholderTextColor="#999"
            />

            <View style={styles.modalButtons}>
              {editingId ? (
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={handleDeleteContact}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveContact}
              >
                <Text style={styles.saveButtonText}>Save Contact</Text>
              </TouchableOpacity>
            </View>

            {/* Close button for edit mode if we want to cancel without deleting */}
            {editingId && (
              <TouchableOpacity
                style={styles.closeModalTextButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeModalText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* Premium Info Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={premiumModalVisible}
        onRequestClose={() => setPremiumModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.premiumModalHeader}>
              <Ionicons name="star" size={32} color="#FFD700" />
              <Text style={styles.premiumModalTitle}>Premium Service</Text>
            </View>

            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.premiumModalText}>
                By subscribing to our membership, you join a 24/7 service dedicated to monitoring your signals and emergencies. We ensure your well-being by immediately contacting your emergency numbers and collaborating with authorities whenever necessary.
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={[styles.button, styles.saveButton, { marginTop: 20 }]}
              onPress={() => setPremiumModalVisible(false)}
            >
              <Text style={styles.saveButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F8', // Light friendly background
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F2F4F8', // Blends with body
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#555',
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statusText: {
    fontSize: 14,
    color: '#27AE60', // Friendly green
    fontWeight: '600',
  },
  // Premium Banner Styles
  premiumBanner: {
    backgroundColor: '#2C3E50',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumTextContent: {
    flex: 1,
    marginRight: 10,
  },
  premiumTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  premiumSubtitle: {
    fontSize: 12,
    color: '#BDC3C7',
    lineHeight: 16,
  },
  premiumButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  premiumButtonText: {
    color: '#2C3E50',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8898AA',
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2, // Android shadow
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
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
    color: '#2C3E50',
    marginBottom: 2,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
  },
  itemValue: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  itemSubtext: {
    fontSize: 13,
    color: '#999',
  },
  editBadge: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  addContactText: {
    color: '#4B9FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#4B9FFF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
    borderStyle: 'dashed',
  },
  outlineButtonText: {
    color: '#4B9FFF',
    fontWeight: '600',
    fontSize: 15,
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 20,
  },
  emptyStateText: {
    color: '#999',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4B9FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 24,
    textAlign: 'center',
  },
  premiumModalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  premiumModalText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'justify',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F8F9FA',
    color: '#333',
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F1F3F5',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  deleteButtonText: {
    color: '#D32F2F',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4B9FFF', // Friendly Blue
    shadowColor: '#4B9FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  closeModalTextButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  closeModalText: {
    color: '#999',
    fontSize: 14,
  },
});
