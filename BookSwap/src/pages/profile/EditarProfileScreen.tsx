import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@env';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.log('Token não encontrado');
        // Redirecione para a tela de login ou tome outra ação apropriada
        return;
      }

      const response = await fetch(`${API_BASE_URL}/perfil/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (Array.isArray(data) && data.length > 0) {
          setProfile(data[0]);
          const { usuario } = data[0];
          setFirstName(usuario.first_name);
          setLastName(usuario.last_name);
          setEmail(usuario.email);
        } else {
          console.log('Nenhum dado de perfil encontrado');
        }
      } else {
        console.log('Erro ao buscar dados do perfil:', data);
      }
    } catch (error) {
      console.log('Erro ao buscar dados do perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (!token) {
        console.log('Token não encontrado');
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/usuario/${profile.usuario.id}/`, {
        method: 'PATCH', // Alterado de 'PUT' para 'PATCH'
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
        }),
      });
  
      if (response.ok) {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso');
        navigation.goBack();
      } else {
        const data = await response.json();
        console.log('Erro ao atualizar perfil:', data);
        Alert.alert('Erro', 'Não foi possível atualizar o perfil');
      }
    } catch (error) {
      console.log('Erro ao atualizar perfil:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2c3e51" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.noProfileText}>Nenhum dado de perfil disponível.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#95a5a6"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Sobrenome"
        placeholderTextColor="#95a5a6"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#95a5a6"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#2c3e51',
    padding:16,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex:1,
    backgroundColor: '#2c3e51',
    alignItems:'center',
    justifyContent:'center',
  },
  title: {
    fontSize:28,
    fontWeight:'bold',
    color: '#fff',
    marginBottom:24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#34495e',
    color: '#fff',
    padding:12,
    marginBottom:16,
    borderRadius:8,
  },
  saveButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize:18,
    fontWeight: 'bold',
  },
  noProfileText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default EditProfileScreen;
