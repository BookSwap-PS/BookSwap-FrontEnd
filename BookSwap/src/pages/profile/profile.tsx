import React, { useState, useEffect } from 'react';
import { API_BASE_URL, API_DEV_URL } from '@env';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import * as Progress from 'react-native-progress';

const UserProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.log('Token não encontrado');
        return;
      }

      const decodedToken = jwtDecode(token);
      const authenticatedUserId = decodedToken.user_id;
      console.log('Authenticated User ID:', authenticatedUserId);
      const apiUrl = API_BASE_URL || API_DEV_URL;

      // Buscar perfil associado ao usuário autenticado
      console.log('Fetching profile for user ID:', authenticatedUserId);
      const response = await fetch(`${apiUrl}/perfil/?usuario=${authenticatedUserId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Fetched profile data:', data);

      // Verifique se o perfil retornado é o correto
      if (response.ok && Array.isArray(data) && data.length > 0) {
        const correctProfile = data.find(profile => profile.usuario.id === authenticatedUserId);
        if (correctProfile) {
          setProfile(correctProfile);
        } else {
          console.log('Perfil correspondente ao usuário não encontrado.');
        }
      } else {
        console.log('Erro ao buscar dados do perfil:', data);
      }
    } catch (error) {
      console.log('Erro ao buscar dados do perfil:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserProfile();
  };

  const handleEditProfile = () => {
    if (profile) {
      navigation.navigate('EditProfile', { profile });
    } else {
      console.log('Perfil não encontrado');
    }
  };

  const handleViewLibrary = () => {
    navigation.navigate('UserLibrary');
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#A9A9A9']}
            tintColor={'#A9A9A9'}
            progressBackgroundColor={'#F5F5F5'}
          />
        }
      >
        <Text style={styles.noProfileText}>Nenhum dado de perfil disponível.</Text>
      </ScrollView>
    );
  }

  const { usuario, image, seguindo, pontuacao = 0 } = profile;
  const { first_name, last_name, username, email } = usuario;

  // Calcular nível e progresso para o próximo nível
  const level = Math.floor(pontuacao / 100);
  const pointsToNextLevel = 100 - (pontuacao % 100);
  const progress = (pontuacao % 100) / 100;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#A9A9A9']}
          tintColor={'#A9A9A9'}
          progressBackgroundColor={'#F5F5F5'}
        />
      }
    >
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

      <View style={styles.gamificationContainer}>
        <Text style={styles.levelText}>Nível: {level}</Text>
        <Text style={styles.pointsText}>Pontuação: {pontuacao} pontos</Text>
        <Progress.Bar progress={progress} width={300} color="#ffd700" style={styles.progressBar} />
        <Text style={styles.nextLevelText}>Faltam {pointsToNextLevel} pontos para o próximo nível</Text>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.editButtonText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.libraryButton} onPress={handleViewLibrary}>
        <Text style={styles.libraryButtonText}>Minha Biblioteca</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2a44',
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
    marginBottom: 24,
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
    marginBottom: 16,
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
    marginBottom: 16,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 32,
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
  gamificationContainer: {
    marginTop: 16,
    marginBottom: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  levelText: {
    fontSize: 20,
    color: '#ffd700',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pointsText: {
    fontSize: 16,
    color: '#ecf0f1',
    marginBottom: 8,
  },
  progressBar: {
    marginBottom: 8,
  },
  nextLevelText: {
    fontSize: 16,
    color: '#ecf0f1',
    marginTop: 8,
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
    marginBottom: 20,
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

export default UserProfileScreen;