import React from 'react'; // Importando o React
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Importando o componente de navegação de abas
import { Ionicons } from '@expo/vector-icons'; // Importando ícones da biblioteca Expo
import { View, TouchableOpacity } from 'react-native'; // Importando componentes do React Native
import Home from './home/Home'; // Importando o componente Home
import ListLivro from './livro/ListLivro'; // Importando o componente para listar livros
import CreateLivro from './livro/CreateLivro'; // Importando o componente para criar livros
import Perfil from './profile/profile'; // Importando o componente de perfil
import Configuracoes from './configuracoes/configuracoes'; // Importando o componente de configurações
import SearchUser from './profile/SearchUser'; // Importando o componente de busca de usuários

// Criando o componente de navegação de abas
const Tab = createBottomTabNavigator();

// Componente para o botão de busca personalizado (central na tab bar)
function CustomSearchButton({ children, onPress }) {
  return (
    <TouchableOpacity
      style={{
        top: -30, // Posição elevada do botão
        justifyContent: 'center',
        alignItems: 'center',
        ...styles.shadow, // Aplicando sombras
      }}
      onPress={onPress} // Função chamada ao pressionar o botão
    >
      <View
        style={{
          width: 70,
          height: 70,
          borderRadius: 35, // Botão circular
          backgroundColor: '#FF6347', // Cor do botão central
          justifyContent: 'center',
          alignItems: 'center', // Centralizando o conteúdo no botão
        }}
      >
        {children} {/* Conteúdo passado para o botão */}
      </View>
    </TouchableOpacity>
  );
}

// Componente de navegação entre abas
export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      // Configurações para cada aba
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          // Definindo ícones de acordo com a aba
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
            case 'Buscar Usuários':
              iconName = focused ? 'search-circle' : 'search-outline'; // Ícone para a aba de busca de usuários
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />; // Retornando o ícone apropriado
        },
        tabBarActiveTintColor: '#FF6347', // Cor da aba ativa
        tabBarInactiveTintColor: 'gray', // Cor da aba inativa
        tabBarLabelStyle: {
          fontSize: 12, // Tamanho da fonte do rótulo da aba
        },
        tabBarStyle: {
          backgroundColor: '#fff', // Cor de fundo da barra de abas
          height: 60,
          paddingBottom: 5, // Espaçamento inferior da barra
        },
      })}
    >
      {/* Definindo as telas para cada aba */}
      <Tab.Screen name="Início" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="Adicionar" component={CreateLivro} options={{ headerShown: false }} />
      
      {/* Botão de busca central personalizado */}
      <Tab.Screen
        name="Buscar"
        component={ListLivro}
        options={{
          tabBarButton: (props) => (
            <CustomSearchButton {...props}>
              <Ionicons name="search" size={30} color="white" /> {/* Ícone de busca */}
            </CustomSearchButton>
          ),
          headerShown: false,
        }}
      />

      {/* Tela de busca de usuários */}
      <Tab.Screen 
        name="Buscar Usuários" 
        component={SearchUser} 
        options={{ headerShown: false }} 
      />
      
      <Tab.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
      <Tab.Screen name="Configurações" component={Configuracoes} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

// Estilos para o botão de busca central
const styles = {
  shadow: {
    shadowColor: '#7F5DF0', // Cor da sombra
    shadowOffset: {
      width: 0,
      height: 10, // Definindo a posição da sombra
    },
    shadowOpacity: 0.25, // Opacidade da sombra
    shadowRadius: 3.5, // Raio da sombra
    elevation: 5, // Elevação para Android
  },
};