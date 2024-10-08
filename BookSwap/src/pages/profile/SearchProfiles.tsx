import React, { useEffect, useState } from 'react';
import { API_BASE_URL, API_DEV_URL } from '@env'; // Importando URLs base para API
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage para obter o token
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importando para navegação

interface Usuario {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    image?: string | null;
    usuario?: {
        first_name: string;
        last_name: string;
        username: string;
        email: string;
    };
}

export default function SearchUser() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation(); // Inicializando navegação

    // Definindo a URL base da API dependendo do ambiente
    const apiUrl = process.env.NODE_ENV === 'development' ? API_DEV_URL : API_BASE_URL;

    const fetchUsuarios = async (query: string = '') => {
        try {
            setLoading(true);
    
            let url = `${apiUrl}/perfil/`; // Usando o endpoint correto para buscar perfis
            if (query) {
                url += `?search=${query}`;
            }
    
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Perfis encontrados:', data); // Log para verificar a resposta da API
                setUsuarios(data);
            } else {
                const errorData = await response.json();
                console.error('Erro ao buscar perfis:', errorData);
            }
        } catch (error) {
            console.error('Erro ao buscar perfis:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUsuarios();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleSearch = () => {
        fetchUsuarios(searchQuery);
    };

    const handleProfileClick = (id: number) => {
        navigation.navigate('UserProfile', { userId: id });  // Navegando para a página de perfil (UserProfile)
    }; 

    const renderItem = ({ item }: { item: Usuario }) => {
        // Acessando os dados, seja diretamente ou dentro de 'usuario'
        const firstName = item.first_name || item.usuario?.first_name || '';
        const lastName = item.last_name || item.usuario?.last_name || '';
        const username = item.username || item.usuario?.username || '';

        return (
            <TouchableOpacity style={styles.userCard} onPress={() => handleProfileClick(item.id)}>
                <View style={styles.userInfoContainer}>
                    {item.image ? (
                        <Image source={{ uri: item.image }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Text style={styles.placeholderText}>{firstName ? firstName.charAt(0) : '?'}</Text>
                        </View>
                    )}
                    <View style={styles.textContainer}>
                        <Text style={styles.name}>{firstName} {lastName}</Text>
                        <Text style={styles.username}>{username ? `@${username}` : ''}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por nome, sobrenome ou username..."
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Buscar</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={usuarios}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#A9A9A9']}
                        tintColor={'#A9A9A9'}
                        progressBackgroundColor={'#F5F5F5'}
                    />
                }
                ListEmptyComponent={<Text>Nenhum usuário encontrado.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1f2a44',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    searchButton: {
        marginLeft: 10,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: 20, // Reduzido o padding inferior para ajustar o tamanho dos containers
    },
    userCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 8, // Reduzido o padding do card
        marginBottom: 10, // Reduzido o espaço entre os cards
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 }, // Diminuído o shadow
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 60, // Reduzido o tamanho da imagem
        height: 60, // Reduzido o tamanho da imagem
        borderRadius: 30,
        marginRight: 10,
    },
    placeholderImage: {
        width: 60, // Reduzido o tamanho do placeholder
        height: 60, // Reduzido o tamanho do placeholder
        borderRadius: 30,
        backgroundColor: '#34495e',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    placeholderText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 14, // Reduzido o tamanho da fonte do nome
        fontWeight: 'bold',
        textAlign: 'left',
    },
    username: {
        fontSize: 12, // Reduzido o tamanho da fonte do username
        color: '#888',
        textAlign: 'left',
    },
});