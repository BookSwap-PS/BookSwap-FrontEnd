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
import SearchUser from './src/pages/profile/SearchUser'; // Importando o componente SearchUser

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* Define a barra de status com fundo branco e ícones escuros */}
      <StatusBar barStyle="light-content" backgroundColor="#1A2B45" />
      
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="Registro" component={Registro} options={{ title: 'Registro', headerShown: false }} />
        <Stack.Screen name="Main" component={BottomTabNavigator} options={{ title: 'Inicio', headerShown: false }} />
        <Stack.Screen name="LivroDetail" component={LivroDetail} options={{ title: 'Detalhes do Livro', headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil', headerShown: false }} />
        <Stack.Screen name="UserLibrary" component={UserLibraryScreen} options={{ title: 'UserLibrary', headerShown: false }} />
        
        {/* Adicionando a tela de SearchUser ao Stack */}
        <Stack.Screen name="SearchUser" component={SearchUser} options={{ title: 'Buscar Usuários', headerShown: true }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
