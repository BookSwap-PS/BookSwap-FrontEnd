import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_DEV_URL } from '@env';
import Icon from 'react-native-vector-icons/Ionicons';

const UserHistory = ({ route, navigation }) => {
  const { userId } = route.params; // ID do usuário visualizado
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchUserHistory();
  }, []);

  const fetchUserHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('Token não encontrado');
        return;
      }

      const response = await fetch(`${API_DEV_URL}/historico-trocas/?user=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Histórico de trocas:', data);
        setHistory(data);
      } else {
        console.log('Erro ao buscar histórico de trocas');
      }
    } catch (error) {
      console.log('Erro ao buscar histórico:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserHistory();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.noHistoryText}>Nenhuma troca concluída encontrada.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyText}>Livro: {item.livro.titulo}</Text>
      <Text style={styles.historyText}>Com: {item.usuarioDestino.username}</Text>
      <Text style={styles.historyText}>Data: {new Date(item.dataTroca).toLocaleDateString()}</Text>
      <Text style={styles.historyText}>Mensagem: {item.mensagem}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.totalCountText}>Total de Trocas: {history.length}</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#0000ff']}
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
    zIndex: 1,
  },
  noHistoryText: {
    fontSize: 18,
    color: '#ecf0f1',
    textAlign: 'center',
    marginTop: 20,
  },
  totalCountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginBottom: 16,
    textAlign: 'center',
  },
  historyItem: {
    backgroundColor: '#34495e',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  historyText: {
    fontSize: 16,
    color: '#ecf0f1',
    marginBottom: 4,
  },
});

export default UserHistory;
