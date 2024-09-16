import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { API_BASE_URL } from '@env'; 
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles'; // Defina os estilos

interface Usuario {
  nome: string;
  descricao: string;
  dataCriacao: string;
  fotoPerfil?: string | null;
}

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUsuario = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/`);
      const data = await response.json();
      setUsuario(data);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuario();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text>Erro ao carregar as informações do usuário.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Foto de perfil e nome do usuário */}
      <View style={styles.profileHeader}>
        {usuario.fotoPerfil ? (
          <Image source={{ uri: usuario.fotoPerfil }} style={styles.profileImage} />
        ) : (
          <View style={styles.noProfileImage}>
            <Ionicons name="person-circle-outline" size={100} color="#ccc" />
          </View>
        )}
        <Text style={styles.userName}>{usuario.nome}</Text>
      </View>

      {/* Data de criação da conta */}
      <Text style={styles.creationDate}>Data de criação da conta: {usuario.dataCriacao}</Text>

      {/* Descrição */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{usuario.descricao}</Text>
      </View>

      {/* Botões de histórico, resenhas e troca */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Historico')}>
          <Ionicons name="time-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Resenhas')}>
          <Ionicons name="book-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Resenhas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Troca')}>
          <Ionicons name="swap-horizontal-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Quero Trocar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
