import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, RefreshControl, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_DEV_URL } from '@env';
import Icon from 'react-native-vector-icons/Ionicons';

const UserProfile = ({ route, navigation }) => {
  const { userId } = route.params;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [following, setFollowing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
  
      if (!token) {
        console.log('Token não encontrado');
        return;
      }
  
      const authenticatedUserId = await AsyncStorage.getItem('user_id');
      const viewingUserId = String(userId);
  
      const response = await fetch(`${API_DEV_URL}/perfil/${viewingUserId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setProfile(data);
        if (authenticatedUserId) {
          setIsOwner(viewingUserId === String(authenticatedUserId));
        }
        setFollowing(data.is_following !== undefined ? data.is_following : false);
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
    if (followLoading) return;
    setFollowLoading(true);
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
            fetchUserProfile(); // Atualizar o perfil após seguir
            Alert.alert('Sucesso', 'Você agora está seguindo esse usuário.');
        } else {
            const errorData = await response.json();
            Alert.alert('Erro', `Erro ao seguir o usuário: ${errorData.detail || 'Tente novamente mais tarde.'}`);
            console.log('Erro ao seguir o usuário:', errorData);
        }
    } catch (error) {
        console.log('Erro ao tentar seguir o usuário:', error);
        Alert.alert('Erro', 'Erro ao tentar seguir o usuário. Por favor, tente novamente mais tarde.');
    } finally {
        setFollowLoading(false);
    }
};

const handleUnfollow = async () => {
    if (followLoading) return;
    setFollowLoading(true);
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
            fetchUserProfile(); // Atualizar o perfil após deixar de seguir
            Alert.alert('Sucesso', 'Você deixou de seguir este usuário.');
        } else {
            const errorData = await response.json();
            Alert.alert('Erro', `Erro ao deixar de seguir: ${errorData.detail || 'Tente novamente mais tarde.'}`);
            console.log('Erro ao deixar de seguir o usuário:', errorData);
        }
    } catch (error) {
        console.log('Erro ao tentar deixar de seguir o usuário:', error);
        Alert.alert('Erro', 'Erro ao tentar deixar de seguir o usuário. Por favor, tente novamente mais tarde.');
    } finally {
        setFollowLoading(false);
    }
};

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  console.log("Following status:", following);

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

  const { usuario, image, seguidores, seguindo, trocas, pontuacao, criado_em } = profile;
  const { first_name, last_name, username } = usuario || {};

  const level = Math.floor((pontuacao || 0) / 100);
  const pointsToNextLevel = 100 - ((pontuacao || 0) % 100);
  const progress = ((pontuacao || 0) % 100) / 100;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchUserProfile();
          }}
          colors={['#A9A9A9']}
          tintColor={'#A9A9A9'}
          progressBackgroundColor={'#F5F5F5'}
        />
      }
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Sem Imagem</Text>
          </View>
        )}
        <Text style={styles.username}>@{username}</Text>
        <Text style={styles.name}>{first_name} {last_name}</Text>
        <Text style={styles.infoText}>desde: {formatDate(criado_em)}</Text>
        <Text style={styles.infoText}>trocas: {trocas || 0}</Text>
      </View>

      <View style={styles.followContainer}>
        <Text style={styles.followers}>{seguidores?.length || 0} Seguidores</Text>
        <Text style={styles.following}>{seguindo?.length || 0} Seguindo</Text>
      </View>

      {!isOwner && (
        <TouchableOpacity
          style={following ? styles.unfollowButton : styles.followButton}
          onPress={following ? handleUnfollow : handleFollow}
          disabled={followLoading}
        >
          <Text style={following ? styles.unfollowButtonText : styles.followButtonText}>
            {following ? 'Deixar de Seguir' : 'Seguir'}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.gamificationContainer}>
        <Text style={styles.levelText}>Nível: {level}</Text>
        <Text style={styles.pointsText}>Pontuação: {pontuacao || 0} pontos</Text>
        <View style={styles.progressBar}>
          <View style={{ ...styles.progress, width: `${progress * 100}%` }} />
        </View>
        <Text style={styles.nextLevelText}>Faltam {pointsToNextLevel} pontos para o próximo nível</Text>
      </View>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate(isOwner ? 'UserLibrary' : 'OtherUserLibrary', { userId })}
      >
        <Icon name="book" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>{isOwner ? 'Minha Biblioteca' : 'Biblioteca'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('UserHistory', { userId })}>
        <Icon name="time" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>Histórico</Text>
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
  gamificationContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  levelText: {
    fontSize: 20,
    color: '#ffd700',
    fontWeight: 'bold',
  },
  pointsText: {
    fontSize: 16,
    color: '#ecf0f1',
    marginBottom: 8,
  },
  progressBar: {
    width: '80%',
    height: 10,
    backgroundColor: '#34495e',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progress: {
    height: '100%',
    backgroundColor: '#ffd700',
  },
  nextLevelText: {
    fontSize: 16,
    color: '#ecf0f1',
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