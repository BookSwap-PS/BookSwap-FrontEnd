import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_DEV_URL } from '@env';

const UserProfile = ({ route, navigation }) => {
  const { userId } = route.params; // Pega o ID do perfil passado pela navegação
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [following, setFollowing] = useState(false);
  const [isOwner, setIsOwner] = useState(false); // Verifica se é o usuário autenticado

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const authenticatedUserId = await AsyncStorage.getItem('user_id'); // Certifica-se de que o user_id está sendo recuperado

      console.log('Authenticated User ID:', authenticatedUserId); // Log para verificar se o user_id está correto

      if (!token || !authenticatedUserId) {
        console.log('Token ou ID do usuário não encontrado');
        return;
      }

      const response = await fetch(`${API_DEV_URL}/perfil/${userId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data);
        // Verifica se o perfil que está sendo exibido é o do usuário autenticado
        setIsOwner(userId === authenticatedUserId); 
        // Supondo que o backend retorne se o usuário autenticado já está seguindo o perfil
        setFollowing(data.is_following || false);
      } else {
        console.log('Erro ao buscar perfil do usuário:', data);
      }
    } catch (error) {
      console.log('Erro ao buscar perfil do usuário:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleFollow = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_DEV_URL}/seguir/${userId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setFollowing(true);
        alert('Você agora está seguindo esse usuário.');
      } else {
        console.log('Erro ao seguir o usuário.');
      }
    } catch (error) {
      console.log('Erro ao tentar seguir o usuário:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_DEV_URL}/seguir/${userId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setFollowing(false);
        alert('Você deixou de seguir este usuário.');
      } else {
        console.log('Erro ao deixar de seguir o usuário.');
      }
    } catch (error) {
      console.log('Erro ao tentar deixar de seguir o usuário:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Perfil não encontrado.</Text>
      </View>
    );
  }

  const { usuario, image, seguindo } = profile;
  const { first_name, last_name, username, email } = usuario;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchUserProfile}
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

      {/* Exibe botão de seguir ou deixar de seguir caso não seja o usuário autenticado */}
      {!isOwner && (
        following ? (
          <TouchableOpacity style={styles.unfollowButton} onPress={handleUnfollow}>
            <Text style={styles.unfollowButtonText}>Deixar de Seguir</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
            <Text style={styles.followButtonText}>Seguir</Text>
          </TouchableOpacity>
        )
      )}
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
  followButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  unfollowButton: {
    backgroundColor: '#c0392b',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
  },
  unfollowButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserProfile;
