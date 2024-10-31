import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/pages/login/Login';
import Registro from './src/pages/registroUser/Registro';
import LivroDetail from './src/pages/livro/LivroDetail';
import EditProfileScreen from './src/pages/profile/EditarProfileScreen';
import BottomTabNavigator from './src/pages/BottomTabNavigator';
import UserLibraryScreen from './src/pages/biblioteca/UserBiblioteca';
import UserProfile from './src/pages/profile/UserProfile';
import SearchUser from './src/pages/profile/SearchProfiles';
import CreateResenha from './src/pages/livro/CreateResenha';
import EditLivro from './src/pages/livro/EditLivro';
import UserHistory from './src/pages/profile/UserHistory';
import OtherUserLibraryScreen from './src/pages/biblioteca/OtherUserLibraryScreen'; // Importando a biblioteca de outros usuários

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#1A2B45" />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="Registro" component={Registro} options={{ title: 'Registro', headerShown: false }} />
        <Stack.Screen name="Main" component={BottomTabNavigator} options={{ title: 'Início', headerShown: false }} />
        <Stack.Screen name="LivroDetail" component={LivroDetail} options={{ title: 'Detalhes do Livro', headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil', headerShown: false }} />
        <Stack.Screen name="UserLibrary" component={UserLibraryScreen} options={{ title: 'Minha Biblioteca', headerShown: false }} />
        <Stack.Screen name="UserProfile" component={UserProfile} options={{ title: 'Perfil do Usuário', headerShown: false }} />
        <Stack.Screen name="OtherUserLibrary" component={OtherUserLibraryScreen} options={{ title: 'Biblioteca do Usuário', headerShown: false }} />
        <Stack.Screen name="SearchUser" component={SearchUser} options={{ title: 'Buscar Usuários', headerShown: false }} />
        <Stack.Screen name="CreateResenha" component={CreateResenha} options={{ title: 'Criar Resenha', headerShown: false }} />
        <Stack.Screen name="EditLivro" component={EditLivro} options={{ title: 'Editar Livro', headerShown: false }} />
        <Stack.Screen name="UserHistory" component={UserHistory} options={{ title: 'Histórico de Trocas', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
