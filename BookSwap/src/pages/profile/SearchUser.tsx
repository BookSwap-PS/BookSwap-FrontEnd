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

interface Usuario {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    image?: string | null;
}

export default function SearchUser() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Definindo a URL base da API dependendo do ambiente
    const apiUrl = process.env.NODE_ENV === 'development' ? API_DEV_URL : API_BASE_URL;

    const fetchUsuarios = async (query: string = '') => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token'); // Obtendo o token de autenticação do AsyncStorage

            if (!token) {
                console.log('Token não encontrado');
                return;
            }

            let url = `${apiUrl}/usuario/`; // Usando o endpoint para buscar usuários
            if (query) {
                url += `?search=${query}`; 
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Incluindo o token no cabeçalho
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsuarios(data);
            } else {
                console.error('Erro ao buscar usuários:', await response.json());
            }
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
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

    const renderItem = ({ item }: { item: Usuario }) => (
        <TouchableOpacity style={styles.userCard}>
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.profileImage} />
            ) : (
                <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>Sem Imagem</Text>
                </View>
            )}
            <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
            <Text style={styles.username}>@{item.username}</Text>
        </TouchableOpacity>
    );

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
        paddingBottom: 80,
    },
    userCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    placeholderImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#34495e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        color: '#fff',
        fontSize: 16,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },
    username: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
});