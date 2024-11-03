import React, { useState, useEffect } from 'react';
import { API_BASE_URL, API_DEV_URL } from '@env';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import * as Progress from 'react-native-progress'; // Importa a biblioteca para barra de progresso

const ProfileScreen = ({ navigation }) => {
  const [allProfiles, setAllProfiles] = useState([]); // Estado para armazenar todos os perfis
  const [profile, setProfile] = useState(null); // Estado para o perfil do usuário autenticado
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Estado para "pull to refresh"

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Recupera o token do AsyncStorage

      if (!token) {
        console.log('Token não encontrado');
        return;
      }

      // Usando jwt-decode para decodificar o token JWT e obter o user_id
      const decodedToken = jwtDecode(token); 
      const authenticatedUserId = decodedToken.user_id; // Extraindo o user_id do payload

      console.log('Token:', token);
      console.log('Authenticated User ID:', authenticatedUserId);

      if (!authenticatedUserId) {
        console.log('ID do usuário não encontrado no token');
        return;
      }

      console.log("prod: " + `${API_BASE_URL}/perfil/`);
      console.log("dev: " + `${API_DEV_URL}/perfil/`);

      const response = await fetch(`${API_DEV_URL}/perfil/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setAllProfiles(data); // Armazena todos os perfis no estado
        const userProfile = data.find(profile => profile.usuario.id === parseInt(authenticatedUserId));
        if (userProfile) {
          setProfile(userProfile);
        } else {
          console.log('Perfil do usuário autenticado não encontrado');
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
    if (profile) {
      // Passa o perfil do usuário para a tela de edição
      navigation.navigate('EditProfile', { profile }); 
    } else {
      console.log('Perfil não encontrado');
    }
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#A9A9A9']} // Cor neutra (cinza)
            tintColor={'#A9A9A9'} // Cor neutra para iOS
            progressBackgroundColor={'#F5F5F5'} // Fundo neutro
          />
        }
      >
        <Text style={styles.noProfileText}>Nenhum dado de perfil disponível.</Text>
      </ScrollView>
    );
  }

  const { id, usuario, image, seguindo, pontuacao = 0 } = profile;
  const { first_name, last_name, username, email } = usuario;

  // Cálculo do nível e progresso para o próximo nível
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
          colors={['#A9A9A9']} // Cor neutra (cinza)
          tintColor={'#A9A9A9'} // Cor neutra para iOS
          progressBackgroundColor={'#F5F5F5'} // Fundo neutro
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

      {/* Gamificação - Exibição do nível e progresso */}
      <View style={styles.gamificationContainer}>
        <Text style={styles.levelText}>Nível: {level}</Text>
        <Text style={styles.pointsText}>Pontuação: {pontuacao} pontos</Text>
        <Progress.Bar progress={progress} width={300} color="#ffd700" style={styles.progressBar} />
        <Text style={styles.nextLevelText}>Faltam {pointsToNextLevel} pontos para o próximo nível</Text>
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