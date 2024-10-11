import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_DEV_URL } from '@env';
import { jwtDecode } from 'jwt-decode';
import Icon from 'react-native-vector-icons/Ionicons'; // Importa o ícone de seta
import CreateResenha from './CreateResenha';

export default function LivroDetail({ route, navigation }) {
    const { livroId } = route.params;
    const [livro, setLivro] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [authenticatedUserId, setAuthenticatedUserId] = useState(null);

    const fetchLivroDetalhes = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                console.log('Token não encontrado');
                return;
            }

            const decodedToken = jwtDecode(token);
            const userId = decodedToken.user_id;

            if (!userId) {
                console.log('Usuário não encontrado');
            } else {
                console.log('O id do usuário logado é:', userId);
                setAuthenticatedUserId(userId);
            }

            const response = await fetch(`${API_DEV_URL}/livro/${livroId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setLivro(data);
        } catch (error) {
            console.error('Erro ao buscar detalhes do livro:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchLivroDetalhes();
    };

    useEffect(() => {
        fetchLivroDetalhes();
    }, []);

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Carregando detalhes do livro...</Text>
            </View>
        );
    }

    if (!livro) {
        return (
            <View style={styles.container}>
                <Text>Detalhes do livro não disponíveis.</Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#A9A9A9']}
                    tintColor={'#A9A9A9'}
                    progressBackgroundColor={'#F5F5F5'}
                />
            }
        >
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={30} color="#fff" />
            </TouchableOpacity>

            <View style={styles.header}>
                <Text style={styles.bookTitle}>Dados do Livro</Text>
                <View style={styles.coverContainer}>
                    {livro.capa ? (
                        <Image source={{ uri: livro.capa }} style={styles.bookImage} />
                    ) : (
                        <View style={styles.placeholderCover}>
                            <Text style={styles.noImageText}>Sem capa disponível</Text>
                        </View>
                    )}
                </View>
                <View style={styles.detailsContainer}>
                    <Text style={styles.detailText}>Autor: {livro.autor}</Text>
                    <Text style={styles.detailText}>Páginas: {livro.paginas}</Text>
                    <Text style={styles.detailText}>Editora: {livro.editora}</Text>
                    <Text style={styles.detailText}>Descrição: {livro.descricao}</Text>
                    <Text style={styles.detailText}>Publicado em: {livro.dataPublicacao}</Text>
                    <Text style={styles.detailText}>Gênero: {livro.genero}</Text>
                    <Text style={styles.detailText}>Condição: {livro.condicao}</Text>
                    <Text style={styles.detailText}>Dono: {livro.dono}</Text>
                    <Text style={styles.detailText}>Resenha: {livro.resenha}</Text>
                </View>
                {authenticatedUserId === livro.perfil_id && (
                    <TouchableOpacity
                        style={styles.ownerButton}
                        onPress={() => navigation.navigate('CreateResenha', { livroId })}
                    >
                        <Text style={styles.ownerButtonText}>
                        {livro.resenha && livro.resenha.length > 0 ? 'Editar Resenha' : 'Adicionar Resenha'}
                        </Text>
                    </TouchableOpacity>
                )}
                {authenticatedUserId !== livro.perfil_id && (
                  <TouchableOpacity
                  style={styles.ownerButton}
                  onPress={() => navigation.navigate('UserProfile', { userId: livro.perfil_id })}
                  >
                      {/* Envolvemos o texto "Dono" e "livro.dono" em <Text> */}
                      <Text style={styles.ownerButtonText}>
                          Acessar o perfil do(a): {livro.dono}
                      </Text>
                  </TouchableOpacity>
                )}

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#1f2a44',
        padding: 10,
    },
    header: {
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
    bookTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    coverContainer: {
        width: 150,
        height: 220,
        backgroundColor: '#3b5998',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    placeholderCover: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 10,
    },
    noImageText: {
        fontSize: 14,
        color: '#ecf0f1',
    },
    detailsContainer: {
        backgroundColor: '#3b5998',
        borderRadius: 10,
        padding: 10,
        width: '100%',
        maxWidth: 300,
    },
    detailText: {
        color: '#ecf0f1',
        fontSize: 20,
        marginBottom: 5,
    },
    ownerButton: {
        backgroundColor: '#2980b9',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    ownerButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});
