import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';
import Home from './home/Home';
import ListLivro from './livro/ListLivro';
import CreateLivro from './livro/CreateLivro';
import Perfil from './profile/profile';
import Configuracoes from './configuracoes/configuracoes';
import SearchUser from './profile/SearchProfiles'; // Importando o componente de busca de usuários

const Tab = createBottomTabNavigator();

function CustomSearchButton({ children, onPress }) {
  return (
    <TouchableOpacity
      style={{
        top: -25, // Ajustado para um leve deslocamento para cima
        justifyContent: 'center',
        alignItems: 'center',
        ...styles.shadow,
      }}
      onPress={onPress}
    >
      <View
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: '#FF6347', // Cor do botão central
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Início':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Adicionar':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'Perfil':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Configurações':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            case 'Buscar Usuários': // Ícone para a nova aba de busca de usuários
              iconName = focused ? 'people-circle' : 'people-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6347',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 60,
          paddingBottom: 5,
        },
      })}
    >
      <Tab.Screen name="Início" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="Adicionar" component={CreateLivro} options={{ headerShown: false }} />
      
      {/* Central search button */}
      <Tab.Screen
        name="Buscar"
        component={ListLivro} // Substituir pelo componente desejado
        options={{
          tabBarButton: (props) => (
            <CustomSearchButton {...props}>
              <Ionicons name="search" size={30} color="white" />
            </CustomSearchButton>
          ),
          headerShown: false
        }}
      />

      {/* Adicionando a tela de busca de usuários */}
      <Tab.Screen
        name="Buscar Usuários"
        component={SearchUser}
        options={{ 
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'people-circle' : 'people-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      
      <Tab.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
      <Tab.Screen name="Configurações" component={Configuracoes} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const styles = {
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
};