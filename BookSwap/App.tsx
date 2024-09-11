import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserList from './src/pages/UserList'; // Corrigindo caminho do UserList
import Login from './src/pages/login/index';
import Registro from './src/pages/registroUser/Registro';
import Home from './src/pages/home/Home';
import ListLivro from './src/pages/livro/ListLivro';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="UserList">
                <Stack.Screen name="UserList" component={UserList} options={{ title: 'Lista de Usuários' }} />
                <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
                <Stack.Screen name="Registro" component={Registro} options={{ title: 'Registro' }} />
                <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
                <Stack.Screen name="Livro" component={ListLivro} options={{ title: 'Livro' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
