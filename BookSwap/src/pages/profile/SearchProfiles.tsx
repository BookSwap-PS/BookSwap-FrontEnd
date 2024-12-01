import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { useNavigation } from '@react-navigation/native'; 
import { API_DEV_URL } from '@env'; 

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
        id: number;
    };
}

export default function SearchUser() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation(); 

    const fetchUsuarios = async (query: string = '') => {
        try {
            setLoading(true);

            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('Token não encontrado.');
                return;
            }

            console.log('Token usado na requisição:', token);

            let url = `${API_DEV_URL}/perfil/`;
            if (query) {
                url += `?search=${query}`;
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setUsuarios(response.data);
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

    const handleProfileClick = (perfilId: number) => {
        const fetchPerfilUsuario = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    console.error('Token não encontrado.');
                    return;
                }

                console.log('Token usado para buscar perfil:', token);

                const response = await axios.get(`${API_DEV_URL}/perfil/${perfilId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    const perfil = response.data;

                    if (perfil.usuario?.id) {
                        navigation.navigate('UserProfile', { userId: perfil.usuario.id });
                    } else {
                        console.error('Erro: ID do usuário não encontrado no perfil.');
                    }
                } else {
                    console.error('Erro ao buscar o perfil.');
                }
            } catch (error) {
                console.error('Erro ao buscar o perfil:', error);
            }
        };

        fetchPerfilUsuario();
    };

    const renderItem = ({ item }: { item: Usuario }) => {
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
        paddingBottom: 20,
    },
    userCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
    },
    placeholderImage: {
        width: 60,
        height: 60,
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
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    username: {
        fontSize: 12,
        color: '#888',
        textAlign: 'left',
    },
});
