import React, { useState, useEffect } from 'react';
import { API_DEV_URL } from '@env';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';

// Definindo suas rotas
export type RootStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
};

// Definindo o tipo para o usuário
interface Usuario {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
}

// Definindo o tipo para o perfil
interface Profile {
  id: string;
  usuario: Usuario;
  image: string | null; // Pode ser uma string ou null
  seguindo: any[];
}

// Tipagem da navegação
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }: Props) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
          setErrorMessage(null);
        } else {
          setErrorMessage('Nenhum dado de perfil encontrado');
        }
      } else {
        setErrorMessage('Erro ao buscar dados do perfil');
      }
    } catch (error) {
      setErrorMessage('Erro ao buscar dados do perfil');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfileData();
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2c3e51" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#f9f9f9"
          title={refreshing ? "Atualizando..." : ""}
          titleColor="#2c3e51"
        />
      }
    >
      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      {!profile ? (
        <Text style={styles.noProfileText}>Nenhum dado de perfil disponível.</Text>
      ) : (
        <>
          <View style={styles.header}>
            {profile.image ? (
              <Image source={{ uri: profile.image }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Sem Imagem</Text>
              </View>
            )}
            <Text style={styles.name}>{profile.usuario.first_name} {profile.usuario.last_name}</Text>
            <Text style={styles.username}>@{profile.usuario.username}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.email}>{profile.usuario.email}</Text>
            <Text style={styles.following}>Seguindo: {profile.seguindo.length}</Text>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e51',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
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
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noProfileText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ProfileScreen;
