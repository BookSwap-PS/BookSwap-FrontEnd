import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_DEV_URL } from '@env';
import Icon from 'react-native-vector-icons/Ionicons';

const UserBooks = ({ route, navigation }) => {
  const { userId } = route.params; // Recebe o ID do usuário da navegação
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserBooks();
  }, []);

  const fetchUserBooks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('Token não encontrado');
        return;
      }

      const response = await fetch(`${API_DEV_URL}/livro/?user=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Livros do usuário:', data);
        setBooks(data);
      } else {
        console.log('Erro ao buscar livros');
      }
    } catch (error) {
      console.log('Erro ao buscar livros:', error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Finaliza o estado de "refresh"
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserBooks();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookCard} 
      onPress={() => navigation.navigate('LivroDetail', { livroId: item.id })}
    >
      <Text style={styles.bookTitle}>{item.titulo}</Text>
      {item.capa ? (
        <Image source={{ uri: item.capa }} style={styles.bookImage} />
      ) : (
        <Text style={styles.noImageText}>Sem capa disponível</Text>
      )}
      <Text style={styles.bookAuthor}>Autor: {item.autor}</Text>
      <Text style={styles.bookDetails}>Páginas: {item.paginas}</Text>
      <Text style={styles.bookDetails}>Editora: {item.editora}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (books.length === 0) {
    return (
      <View style={styles.container}>
        {/* Botão de voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.noBooksText}>Nenhum livro encontrado para este usuário.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#A9A9A9']}
            tintColor={'#A9A9A9'}
            progressBackgroundColor={'#F5F5F5'}
          />
        }
      />
    </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e51',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: '#34495e',
    borderRadius: 50,
    padding: 8,
  },
  noBooksText: {
    fontSize: 18,
    color: '#ecf0f1',
    textAlign: 'center',
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bookCard: {
    backgroundColor: '#34495e',
    padding: 16,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  bookTitle: {
    fontSize: 16,
    color: '#ecf0f1',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bookImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  noImageText: {
    color: '#bdc3c7',
    fontSize: 14,
    marginBottom: 8,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#ecf0f1',
    marginBottom: 4,
  },
  bookDetails: {
    fontSize: 12,
    color: '#bdc3c7',
  },
});

export default UserBooks;
