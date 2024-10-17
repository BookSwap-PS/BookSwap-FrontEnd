import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, RefreshControl, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_DEV_URL } from '@env';
import { jwtDecode } from 'jwt-decode'; // Removi as chaves para importar corretamente
import Icon from 'react-native-vector-icons/Ionicons'; // Certifique-se de ter esta biblioteca instalada

const UserProfile = ({ route, navigation }) => {
  const { userId } = route.params; // Pega o ID do perfil passado pela navegação
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [following, setFollowing] = useState(false);
  const [isOwner, setIsOwner] = useState(false); // Verifica se é o usuário autenticado
  const [authenticatedUserId, setAuthenticatedUserId] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        console.log('Token não encontrado');
        return;
      }
    
      // Decodificando o token para obter o ID do usuário autenticado
      const decodedToken = jwtDecode(token);
      const userLogId = decodedToken.user_id;
    
      if (!userLogId) {
        console.log("Usuário não encontrado");
        return;
      }
    
      console.log("ID do usuário autenticado:", userLogId);
      setAuthenticatedUserId(userLogId);
    
      const viewingUserId = parseInt(userId);
      console.log("ID do perfil sendo visualizado:", viewingUserId);
    
      const response = await fetch(`${API_DEV_URL}/perfil/${viewingUserId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const response2 = await fetch(`${API_DEV_URL}/perfil/${userLogId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    
      const data = await response.json();
      const data2 = await response2.json();
    
      if (response.ok && response2.ok) {
        setProfile(data);
    
        // Verifica se o perfil que está sendo exibido é o do usuário autenticado
        setIsOwner(viewingUserId === String(userLogId));
    
        // Verifica se o perfil já está sendo seguido usando a lista de IDs
        console.log("Dados do perfil:", data);
    
        if (data2.seguindo && Array.isArray(data2.seguindo)) {
          // Verifica se o ID do perfil visualizado está na lista `data.seguindo`
          const isFollowing = data2.seguindo.includes(viewingUserId);
          console.log("data.seguindo: ", data2.seguindo)
          console.log("viewingUserId: ", viewingUserId)

          setFollowing(isFollowing);
          console.log("Estado following:", isFollowing); // Adicionado console.log para verificação
        } else {
          setFollowing(false);
          console.log("Estado following:", false); // Adicionado console.log para verificação
        }
    
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleFollow = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('Token não encontrado para seguir');
        return;
      }

      const response = await fetch(`${API_DEV_URL}/perfil/${userId}/seguir/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setFollowing(true);
        Alert.alert('Sucesso', 'Você agora está seguindo esse usuário.');
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
      if (!token) {
        console.log('Token não encontrado para deixar de seguir');
        return;
      }

      const response = await fetch(`${API_DEV_URL}/perfil/${userId}/deixar_de_seguir/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setFollowing(false);
        Alert.alert('Sucesso', 'Você deixou de seguir este usuário.');
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

  const { usuario, image, seguidores, seguindo, trocas, criado_em } = profile;
  const { first_name, last_name, username } = usuario || {};

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
        {/* Botão de voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Imagem do perfil */}
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Sem Imagem</Text>
          </View>
        )}
        {/* Nome e informações do usuário */}
        <Text style={styles.username}>@{username}</Text>
        <Text style={styles.name}>{first_name} {last_name}</Text>
        <Text style={styles.infoText}>desde: {formatDate(criado_em)}</Text>
        <Text style={styles.infoText}>trocas: {trocas || 0}</Text>
      </View>

      {/* Seguidores e Seguindo */}
      <View style={styles.followContainer}>
        <Text style={styles.followers}>{seguidores?.length || 0} Seguidores</Text>
        <Text style={styles.following}>{seguindo?.length || 0} Seguindo</Text>
      </View>

      {/* Botões de seguir/deixar de seguir dependendo do estado */}
      {!isOwner && (
        <TouchableOpacity style={following ? styles.unfollowButton : styles.followButton} onPress={following ? handleUnfollow : handleFollow}>
          <Text style={following ? styles.unfollowButtonText : styles.followButtonText}>{following ? 'Deixar de Seguir' : 'seguir'}</Text>
        </TouchableOpacity>
      )}

      {/* Botões de histórico e livros */}
      <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('UserHistory', { userId })}>
        <Icon name="time" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>Histórico</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('UserBooks', { userId })}>
        <Icon name="book" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>Livros</Text>
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
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#34495e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 16,
  },
  username: {
    fontSize: 20,
    color: '#ecf0f1',
    marginTop: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#ecf0f1',
    marginTop: 4,
  },
  followContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 16,
  },
  followers: {
    fontSize: 18,
    color: '#fff',
  },
  following: {
    fontSize: 18,
    color: '#fff',
  },
  followButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  unfollowButton: {
    backgroundColor: '#c0392b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  unfollowButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b5998',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default UserProfile;