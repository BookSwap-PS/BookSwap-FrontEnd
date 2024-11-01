import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_DEV_URL } from '@env';
import Icon from 'react-native-vector-icons/Ionicons';
import { RouteProp } from '@react-navigation/native';

interface Troca {
  id: number;
  solicitante: string;
  destinatario: string;
  livro: string;
  data: string;
  status: string;
  avaliacao?: number;
  pontuacao: number;
}

interface UserHistoryProps {
  route: RouteProp<{ params: { userId: number } }, 'params'>;
}

const UserHistory: React.FC<UserHistoryProps> = ({ route }) => {
  const { userId } = route.params;
  const [history, setHistory] = useState<Troca[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserHistory();
  }, []);

  const fetchUserHistory = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('Token não encontrado');
        return;
      }

      const apiUrl = API_BASE_URL || API_DEV_URL; // Alterna entre produção e desenvolvimento
      const response = await fetch(`${apiUrl}/perfil/${userId}/historico-trocas/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else {
        console.log('Erro ao buscar histórico de trocas');
        Alert.alert('Erro', 'Não foi possível buscar o histórico de trocas.');
      }
    } catch (error) {
      console.log('Erro ao buscar histórico de trocas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2980b9" />
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noHistoryText}>Este usuário não possui histórico de trocas.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Trocas</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Icon name="book-outline" size={20} color="#fff" />
            <View style={styles.historyDetails}>
              <Text style={styles.bookTitle}>{item.livro}</Text>
              <Text style={styles.infoText}>Solicitante: {item.solicitante}</Text>
              <Text style={styles.infoText}>Destinatário: {item.destinatario}</Text>
              <Text style={styles.infoText}>Data: {formatDate(item.data)}</Text>
              <Text style={styles.infoText}>Status: {item.status}</Text>
              <Text style={styles.infoText}>Avaliação: {item.avaliacao || 'N/A'}</Text>
              <Text style={styles.infoText}>Pontuação: {item.pontuacao}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2B45',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1A2B45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  noHistoryText: {
    fontSize: 18,
    color: '#A9A9A9',
    textAlign: 'center',
    marginTop: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2A3B5F',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 3,
  },
  historyDetails: {
    marginLeft: 10,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoText: {
    fontSize: 16,
    color: '#D3D3D3',
  },
});

export default UserHistory;
