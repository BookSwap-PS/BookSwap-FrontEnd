import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, RefreshControl, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_DEV_URL } from '@env';
import { jwtDecode } from 'jwt-decode';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';

const UserProfile = ({ route, navigation }) => {
  const { userId } = route.params;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [following, setFollowing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
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
    
      const decodedToken = jwtDecode(token);
      const userLogId = Number(decodedToken.user_id);
      setAuthenticatedUserId(userLogId);
    
      const viewingUserId = Number(userId);
      console.log("ID do perfil sendo visualizado:", viewingUserId);
    
      const response = await fetch(`${API_DEV_URL}/perfil/by-user/${viewingUserId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Erro ao buscar perfil do usuário visualizado:', errorData);
        setProfile(null);
        return;
      }

      const data = await response.json();
      console.log("Perfil visualizado:", data);
      setProfile(data);
      setIsOwner(viewingUserId === userLogId);

      if (viewingUserId !== userLogId) { 
        const response2 = await fetch(`${API_DEV_URL}/perfil/by-user/${userLogId}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response2.ok) {
          const data2 = await response2.json();
          console.log("Perfil autenticado:", data2);
          
          if (Array.isArray(data2.seguindo)) {
            setFollowing(data2.seguindo.includes(viewingUserId));
          } else {
            console.log('Erro: O campo "seguindo" não é um array.');
            setFollowing(false);
          }
        } else {
          const errorData2 = await response2.json();
          console.log('Erro ao buscar perfil autenticado:', errorData2);
          setFollowing(false);
        }
      } else {
        setFollowing(false);
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
        const errorData = await response.json();
        console.log('Erro ao seguir o usuário:', errorData);
        Alert.alert('Erro', 'Não foi possível seguir o usuário.');
      }
    } catch (error) {
      console.log('Erro ao tentar seguir o usuário:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar seguir o usuário.');
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
        const errorData = await response.json();
        console.log('Erro ao deixar de seguir o usuário:', errorData);
        Alert.alert('Erro', 'Não foi possível deixar de seguir o usuário.');
      }
    } catch (error) {
      console.log('Erro ao tentar deixar de seguir o usuário:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar deixar de seguir o usuário.');
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
        <Text style={styles.errorText}>Perfil não encontrado.</Text>
      </View>
    );
  }

  const { usuario, image, seguidores, seguindo, trocas, criado_em, nivel, progresso } = profile;
  const { first_name, last_name, username } = usuario || {};

  return (
    <View style={{ flex: 1 }}>
      {/* Botão de voltar fixo no canto superior esquerdo */}
      <TouchableOpacity style={styles.backButtonContainer} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

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

          <Text style={styles.username}>@{username}</Text>
          <Text style={styles.name}>{first_name} {last_name}</Text>
          <Text style={styles.infoText}>Desde: {formatDate(criado_em)}</Text>
          <Text style={styles.infoText}>Trocas: {trocas || 0}</Text>

          <Text style={styles.levelText}>Nível: {nivel || 1}</Text>
          <Progress.Bar 
            progress={progresso ? Math.min(progresso / 100, 1) : 0} 
            style={styles.progressBar}
            color="#3498db"
            unfilledColor="#d3d3d3"
            borderWidth={1}
            borderRadius={10}
            width={250} // Aumenta a largura da barra de progresso
          />
        </View>

        <View style={styles.followContainer}>
          <Text style={styles.followers}>{seguidores?.length || 0} Seguidores</Text>
          <Text style={styles.following}>{seguindo?.length || 0} Seguindo</Text>
        </View>

        {!isOwner && (
          <TouchableOpacity 
            style={following ? styles.unfollowButton : styles.followButton} 
            onPress={following ? handleUnfollow : handleFollow}
          >
            <Text style={following ? styles.unfollowButtonText : styles.followButtonText}>
              {following ? 'Deixar de Seguir' : 'Seguir'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigation.navigate('UserHistory', { userId })}
        >
          <Icon name="time" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Histórico</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigation.navigate('UserBooks', { userId })}
        >
          <Icon name="book" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Livros</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2a44',
    padding: 16,
    alignItems: 'center',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 8,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#2c3e51',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 56,
    marginBottom: 20,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 16,
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
    fontSize: 18,
  },
  username: {
    fontSize: 24,
    color: '#ecf0f1',
    marginVertical: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 4,
  },
  infoText: {
    fontSize: 18,
    color: '#b0bec5',
    marginBottom: 6,
    textAlign: 'center',
  },
  levelText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffb347',
    marginBottom: 8,
  },
  progressBar: {
    marginTop: 8,
    height: 20,
    borderRadius: 10,
  },
  followContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginVertical: 20,
  },
  followers: {
    fontSize: 20,
    color: '#ecf0f1',
    fontWeight: '600',
  },
  following: {
    fontSize: 20,
    color: '#ecf0f1',
    fontWeight: '600',
  },
  followButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  unfollowButton: {
    backgroundColor: '#c0392b',
    paddingVertical: 14,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  unfollowButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b5998',
    paddingVertical: 14,
    width: '80%',
    borderRadius: 10,
    justifyContent: 'center',
    marginVertical: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default UserProfile;