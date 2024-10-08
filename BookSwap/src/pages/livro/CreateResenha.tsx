import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_DEV_URL } from '@env';
import Escrevendo from "../../assets/escrevendo.png";
import Icon from 'react-native-vector-icons/Ionicons'; // Importa o ícone

export default function CreateResenha({ route, navigation }) {
  const { livroId } = route.params; // Recebe o ID do livro
  const [resenha, setResenha] = useState('');
  const [loading, setLoading] = useState(true);
  const [inputHeight, setInputHeight] = useState(150); // Estado para controlar a altura do TextInput
  const maxCaracteres = 1500;

  // Função para buscar a resenha existente
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
      setResenha(data.resenha || ''); // Preenche a resenha existente
    } catch (error) {
      console.error('Erro ao buscar detalhes do livro:', error);
    } finally {
      setLoading(false);
    }
  };

  
  const handleEnviarResenha = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_DEV_URL}/livro/${livroId}/`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resenha }), 
      });

      if (response.ok) {
        alert('Resenha atualizada com sucesso!');
        navigation.goBack(); 
      } else {
        console.error('Erro ao atualizar resenha');
      }
    } catch (error) {
      console.error('Erro ao salvar resenha:', error);
    }
  };

  useEffect(() => {
    fetchLivroDetalhes();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando resenha...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Ícone de voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Adicionar Resenha</Text>
      <Image source={Escrevendo} style={styles.image} />
      <TextInput
        style={[styles.input, { height: inputHeight }]} 
        placeholder="Digite a sua resenha aqui"
        value={resenha}
        onChangeText={(text) => setResenha(text)}
        multiline={true}
        onContentSizeChange={(event) =>
          setInputHeight(event.nativeEvent.contentSize.height) 
        }
        maxLength={maxCaracteres} 
      />
      <Text style={styles.charCount}>
        {resenha.length}/{maxCaracteres} caracteres
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleEnviarResenha}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1A2B45',
    justifyContent: 'flex-start',
  },
  backButton: {
    position: 'absolute',
    top: 40,  
    left: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  image: {
    width: 100, 
    height: 100, 
    resizeMode: 'contain', 
    alignSelf: 'center', 
    marginBottom: 20, 
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  charCount: {
    textAlign: 'right',
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3C5A99',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
