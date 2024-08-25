import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios'; // Importando o axios

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Fazendo uma requisição POST para a API de autenticação
      const response = await axios.post('(URL DA API)', {
        username: email,
        password: password,
      });

      const token = response.data.token;
      console.log('Login bem-sucedido, token:', token);
      
      // Aqui você pode armazenar o token usando AsyncStorage ou outra solução
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Erro', 'Nome de usuário ou senha incorretos');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/Logo.png')} />
      <Text style={styles.title}>LOGIN</Text>
      
      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite aqui seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite aqui sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Ou</Text>

      <View style={styles.footer}>
        <Text>Não tem uma conta? </Text>
        <TouchableOpacity>
          <Text style={styles.signupText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    color: '#ffffff',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#ffffff',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    color: '#ffffff',
    marginVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
