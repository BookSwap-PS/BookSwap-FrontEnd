import React, { useState, useEffect } from 'react';
import { API_BASE_URL, API_DEV_URL } from '@env';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Estado para "pull to refresh"

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.log('Token não encontrado');
        return;
      }

      const response = await fetch(`${API_DEV_URL}/perfil/`, {
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
      setRefreshing(false); // Finaliza o estado de "refresh"
    }
  };

  // Função chamada quando o usuário puxa para recarregar
  const onRefresh = () => {
    setRefreshing(true);
    fetchProfileData();
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile'); // Navega para a tela de edição de perfil
  };

  const handleViewLibrary = () => {
    navigation.navigate('UserLibrary'); // Navega para a tela de biblioteca
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2c3e51" />
      </View>
    );
  }

  if (!profile) {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.noProfileText}>Nenhum dado de perfil disponível.</Text>
      </ScrollView>
    );
  }

  const { id, usuario, image, seguindo } = profile;
  const { first_name, last_name, username, email } = usuario;

  // Verifica se a imagem é uma URL ou base64 e ajusta o prefixo adequadamente
  const profileImageUri = image
    ? image.startsWith('http')  // Se a imagem é uma URL completa
      ? image
      : `data:image/jpeg;base64,${image}`  // Caso seja base64
    : null;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        {profileImageUri ? (
          <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
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

      {/* Botão para editar o perfil */}
      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.editButtonText}>Editar Perfil</Text>
      </TouchableOpacity>

      {/* Botão para ver a Biblioteca do usuário */}
      <TouchableOpacity style={styles.libraryButton} onPress={handleViewLibrary}>
        <Text style={styles.libraryButtonText}>Minha Biblioteca</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e51',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#2c3e51',
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  username: {
    fontSize: 20,
    color: '#ecf0f1',
    marginBottom: 8,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  email: {
    fontSize: 18,
    color: '#ecf0f1',
    marginBottom: 8,
  },
  following: {
    fontSize: 18,
    color: '#ecf0f1',
    marginBottom: 24,
  },
  editButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  libraryButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: 'center',
  },
  libraryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noProfileText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ProfileScreen;
