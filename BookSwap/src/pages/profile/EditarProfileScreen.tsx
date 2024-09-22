import React, { useState, useEffect } from 'react';
import { API_BASE_URL, API_DEV_URL } from '@env';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null); // Novo estado para a imagem
  const [loading, setLoading] = useState(true);

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
          const { usuario, image } = data[0];
          setFirstName(usuario.first_name);
          setLastName(usuario.last_name);
          setEmail(usuario.email);
          setUsername(usuario.username);
          setImage(image);  // Definindo a imagem existente do perfil
        } else {
          console.log('Nenhum dado de perfil encontrado');
        }
      } else {
        console.log('Erro ao buscar dados do perfil:', data);
      }
    } catch (error) {
      console.log('Erro ao buscar dados do perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Desculpe, precisamos de permissão para acessar suas fotos.');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri); // Define o caminho da imagem selecionada
    }
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.log('Token não encontrado');
        return;
      }

      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('email', email);
      formData.append('username', username);

      if (password) {
        formData.append('password', password);
      }

      if (image) {
        const uriParts = image.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('image', {
          uri: image,
          name: `profile.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      // Enviar os dados sem definir manualmente o Content-Type
      const response = await fetch(`${API_DEV_URL}/perfil/${profile.usuario.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso');
        navigation.goBack();
      } else {
        const data = await response.json();
        console.log('Erro ao atualizar perfil:', data);
        Alert.alert('Erro', 'Não foi possível atualizar o perfil');
      }
    } catch (error) {
      console.log('Erro ao atualizar perfil:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2c3e51" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.noProfileText}>Nenhum dado de perfil disponível.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#95a5a6"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Sobrenome"
        placeholderTextColor="#95a5a6"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#95a5a6"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Nome de usuário"
        placeholderTextColor="#95a5a6"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Nova Senha"
        placeholderTextColor="#95a5a6"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
        <Text style={styles.imagePickerButtonText}>Escolher Foto</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.profileImage} />}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#2c3e51',
    padding:16,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex:1,
    backgroundColor: '#2c3e51',
    alignItems:'center',
    justifyContent:'center',
  },
  title: {
    fontSize:28,
    fontWeight:'bold',
    color: '#fff',
    marginBottom:24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#34495e',
    color: '#fff',
    padding:12,
    marginBottom:16,
    borderRadius:8,
  },
  saveButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize:18,
    fontWeight: 'bold',
  },
  imagePickerButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePickerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
  },
  noProfileText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default EditProfileScreen;
