import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/pages/login/Login';
import Registro from './src/pages/registroUser/Registro';
import LivroDetail from './src/pages/livro/LivroDetail';
import BottomTabNavigator from './src/pages/BottomTabNavigator'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        
        <Stack.Screen name="Login" component={Login} options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="Registro" component={Registro} options={{ title: 'Registro', headerShown: false  }} />

        
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{ headerShown: false }} 
        />

        <Stack.Screen name="LivroDetail" component={LivroDetail} options={{ title: 'Detalhes do Livro', headerShown: false  }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
