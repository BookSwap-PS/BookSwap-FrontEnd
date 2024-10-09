import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; // Navegação principal do app
import { createStackNavigator } from '@react-navigation/stack'; // Criação de navegação em pilha (Stack)
import Login from './src/pages/login/Login'; // Tela de login
import Registro from './src/pages/registroUser/Registro'; // Tela de registro de novo usuário
import LivroDetail from './src/pages/livro/LivroDetail'; // Tela de detalhes de um livro
import EditProfileScreen from './src/pages/profile/EditarProfileScreen'; // Tela de edição de perfil
import BottomTabNavigator from './src/pages/BottomTabNavigator'; // Navegação por abas
import UserLibraryScreen from './src/pages/biblioteca/UserBiblioteca'; // Tela de biblioteca do usuário
import UserProfile from './src/pages/profile/UserProfile'; // Tela de perfil de um usuário
import SearchUser from './src/pages/profile/SearchUser'; // Tela de busca de usuários

// Cria o stack de navegação
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* Define a barra de status com fundo branco e ícones claros */}
      <StatusBar barStyle="light-content" backgroundColor="#1A2B45" />
      
      {/* Configura o Stack.Navigator para a navegação entre telas */}
      <Stack.Navigator initialRouteName="Login">
        {/* Tela de Login */}
        <Stack.Screen name="Login" component={Login} options={{ title: 'Login', headerShown: false }} />
        
        {/* Tela de Registro de Usuário */}
        <Stack.Screen name="Registro" component={Registro} options={{ title: 'Registro', headerShown: false }} />
        
        {/* Navegação principal por abas (Bottom Tab) */}
        <Stack.Screen name="Main" component={BottomTabNavigator} options={{ title: 'Inicio', headerShown: false }} />
        
        {/* Tela de Detalhes de um Livro */}
        <Stack.Screen name="LivroDetail" component={LivroDetail} options={{ title: 'Detalhes do Livro', headerShown: false }} />
        
        {/* Tela para Edição de Perfil do Usuário */}
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil', headerShown: false }} />
        
        {/* Tela da Biblioteca do Usuário */}
        <Stack.Screen name="UserLibrary" component={UserLibraryScreen} options={{ title: 'UserLibrary', headerShown: false }} />
        
        {/* Tela do Perfil de Outro Usuário */}
        <Stack.Screen name="UserProfile" component={UserProfile} options={{ title: 'UserProfile', headerShown: false }} />

        {/* Tela de Busca de Usuários */}
        <Stack.Screen name="SearchUser" component={SearchUser} options={{ title: 'Buscar Usuários', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
