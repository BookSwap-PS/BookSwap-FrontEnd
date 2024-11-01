import React, { useEffect, useState } from 'react';
import { API_BASE_URL, API_DEV_URL } from '@env';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Livro {
  id: number;
  titulo: string;
  autor: string;
  paginas: number;
  editora: string;
  descricao: string;
  dataPublicacao: string;
  dono: number;
  capa?: string | null;
}

export default function OtherUserLibraryScreen({ route }) {
  const { userId } = route.params; // ID do usuário cujos livros serão exibidos
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchOtherUserBooks = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const apiUrl = API_BASE_URL || API_DEV_URL;
      const requestUrl = `${apiUrl}/livro/?perfil=${userId}`; // Agora busca pelo perfil
  
      console.log('Request URL:', requestUrl); // Verifica a URL completa
  
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      console.log('Fetched books data:', data);
  
      if (Array.isArray(data)) {
        setLivros(data);
      } else {
        console.log('Erro ao buscar livros do usuário:', data);
      }
    } catch (error) {
      console.error('Erro ao buscar livros do usuário:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const refreshToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) {
        console.log('Refresh token não encontrado');
        return false;
      }

      const apiUrl = API_BASE_URL || API_DEV_URL;
      const response = await fetch(`${apiUrl}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Token renovado com sucesso:', data);
        await AsyncStorage.setItem('token', data.access);
        return true;
      } else {
        console.log('Erro ao renovar o token');
        return false;
      }
    } catch (error) {
      console.error('Erro ao renovar o token:', error);
      return false;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOtherUserBooks();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOtherUserBooks();
  }, []);

  const renderItem = ({ item }: { item: Livro }) => (
    <View style={styles.bookCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate('LivroDetail', { livroId: item.id })}
      >
        <Text style={styles.bookTitle}>{item.titulo}</Text>
        {item.capa ? (
          <Image source={{ uri: item.capa }} style={styles.bookImage} />
        ) : (
          <Text style={styles.noImageText}>Sem capa disponível</Text>
        )}
        <Text>Autor: {item.autor}</Text>
        <Text>Páginas: {item.paginas}</Text>
        <Text>Editora: {item.editora}</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={livros}
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Este usuário ainda não possui nenhum livro cadastrado em sua biblioteca
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2a44',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listContent: {
    paddingBottom: 80,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bookCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  bookImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginTop: 10,
  },
  noImageText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b5998', 
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});