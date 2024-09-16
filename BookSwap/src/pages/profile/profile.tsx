import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@env';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
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
      console.log(`${API_BASE_URL}/perfil/`)
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

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
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

  const { id, usuario, image, seguindo } = profile;
  const { first_name, last_name, username, email } = usuario;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Sem Imagem</Text>
          </View>
        )}
        <Text style={styles.name}>{first_name} {last_name}</Text>
        <Text style={styles.username}>@{username}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.following}>Seguindo: {seguindo.length}</Text>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.editButtonText}>Editar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#2c3e51',
    padding:16,
  },
  loadingContainer: {
    flex:1,
    backgroundColor: '#2c3e51',
    alignItems:'center',
    justifyContent:'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 32,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#fff',
  },
  placeholderImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#34495e',
    alignItems:'center',
    justifyContent:'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 16,
  },
  name: {
    fontSize:28,
    fontWeight:'bold',
    color: '#fff',
    marginTop:16,
  },
  username: {
    fontSize:20,
    color:'#ecf0f1',
    marginBottom: 8,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  email: {
    fontSize:18,
    color:'#ecf0f1',
    marginBottom: 8,
  },
  following: {
    fontSize:18,
    color:'#ecf0f1',
    marginBottom: 24,
  },
  editButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize:18,
    fontWeight: 'bold',
  },
  noProfileText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ProfileScreen;
