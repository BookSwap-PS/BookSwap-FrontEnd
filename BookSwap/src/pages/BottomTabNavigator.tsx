import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';
import Home from './home/Home';
import ListLivro from './livro/ListLivro';
import CreateLivro from './livro/CreateLivro';
import Perfil from './profile/profile';
import SearchUser from './profile/SearchProfiles';
import ChatRequestsScreen from './chat/ChatRequestsScreen'; // Importe o novo componente

const Tab = createBottomTabNavigator();

function CustomSearchButton({ children, onPress }) {
    return (
        <TouchableOpacity
            style={{
                top: -25,
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
                    backgroundColor: '#FF6347',
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
                        case 'Chat':
                            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                            break;
                        case 'Buscar Usuários':
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
            <Tab.Screen
                name="Buscar"
                component={ListLivro}
                options={{
                    tabBarButton: (props) => (
                        <CustomSearchButton {...props}>
                            <Ionicons name="search" size={30} color="white" />
                        </CustomSearchButton>
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Chat"
                component={ChatRequestsScreen} // Adicione a tela de chat
                options={{ headerShown: false }}
            />
            <Tab.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
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
