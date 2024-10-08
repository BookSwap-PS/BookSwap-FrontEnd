import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_DEV_URL } from '@env';
import CreateResenha from './CreateResenha'; // Importando a tela de criar resenha

export default function LivroDetail({ route, navigation }) {
  const { livroId } = route.params;
  const [livro, setLivro] = useState(null);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar os detalhes do livro
  const fetchLivroDetalhes = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_DEV_URL}/livro/${livroId}/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setLivro(data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do livro:', error);
    }
  };

  // Função para buscar os detalhes do usuário logado
  const fetchUsuarioLogado = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_DEV_URL}/perfil/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        setUsuarioLogado(data[0].usuario); // Supondo que o campo `usuario` contém as informações do usuário logado
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário logado:', error);
    }
  };

  // Carregar dados do livro e do usuário ao montar o componente
  useEffect(() => {
    setLoading(true);
    fetchLivroDetalhes();
    fetchUsuarioLogado();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Carregando detalhes do livro...</Text>
      </View>
    );
  }

  if (!livro) {
    return (
      <View style={styles.container}>
        <Text>Detalhes do livro não disponíveis.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.bookTitle}>{livro.titulo}</Text>
      {livro.capa ? (
        <Image source={{ uri: livro.capa }} style={styles.bookImage} />
      ) : (
        <Text style={styles.noImageText}>Sem capa disponível</Text>
      )}
      <Text>Autor: {livro.autor}</Text>
      <Text>Páginas: {livro.paginas}</Text>
      <Text>Editora: {livro.editora}</Text>
      <Text>Descrição: {livro.descricao}</Text>
      <Text>Publicado em: {livro.dataPublicacao}</Text>
      <Text>Gênero: {livro.genero}</Text>
      <Text>Condição: {livro.condicao}</Text>
      <Text>Dono: {livro.dono}</Text>

      {/* Verifica se o usuário logado é o dono do livro */}
      {usuarioLogado && livro.dono === usuarioLogado.username && (
        <TouchableOpacity
          style={styles.resenhaButton}
          onPress={() => navigation.navigate('CreateResenha', { livroId })}
        >
          <Text style={styles.resenhaButtonText}>Adicionar Resenha</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  bookTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  bookImage: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#e1e1e1',
  },
  noImageText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  resenhaButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 20,
  },
  resenhaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
