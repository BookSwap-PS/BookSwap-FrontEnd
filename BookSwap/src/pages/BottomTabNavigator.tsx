import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import Home from './home/Home';
import ListLivro from './livro/ListLivro';
import CreateLivro from './livro/CreateLivro';
import Perfil from './profile/profile';
import configuracoes from './configuracoes/configuracoes';
import { GestureResponderEvent } from 'react-native'; // Importação necessária

const Tab = createBottomTabNavigator();

interface CustomSearchButtonProps {
  children: React.ReactNode;
  onPress: (event: GestureResponderEvent) => void; // Altere o tipo para GestureResponderEvent
}

function CustomSearchButton({ children, onPress }: CustomSearchButtonProps) {
  return (
    <TouchableOpacity
      style={{
        top: -30, // Faz o botão subir
        justifyContent: 'center',
        alignItems: 'center',
        ...styles.shadow,
      }}
      onPress={onPress} // Passa a função onPress diretamente
    >
      <View
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: '#375E87', // Cor azul do botão central
          justifyContent: 'center', // Alinha verticalmente
          alignItems: 'center', // Alinha horizontalmente
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
          let iconName: keyof typeof Ionicons.glyphMap;

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
            case 'Buscar':
              iconName = focused ? 'search' : 'search-outline';
              break;
            default:
              iconName = 'home-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#375E87',
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
      <Tab.Screen name="Início" component={Home} />
      <Tab.Screen name="Adicionar" component={CreateLivro} />

      {/* Central search button */}
      <Tab.Screen
        name="Buscar"
        component={ListLivro}
        options={{
          tabBarButton: (props) => (
            <CustomSearchButton
              {...props}
              onPress={(event) => {
                props.onPress?.(event); // Chama a função se existir
              }}
            >
              <Ionicons name="search" size={30} color="white" />
            </CustomSearchButton>
          ),
        }}
      />

      <Tab.Screen name="Perfil" component={Perfil} />
      <Tab.Screen name="Configurações" component={configuracoes} />
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
