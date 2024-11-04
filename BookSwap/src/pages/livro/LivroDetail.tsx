import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_DEV_URL } from '@env';
import { jwtDecode } from 'jwt-decode';
import Icon from 'react-native-vector-icons/Ionicons';

export default function LivroDetail({ route, navigation }) {
    const { livroId } = route.params;
    const [livro, setLivro] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [authenticatedUserId, setAuthenticatedUserId] = useState(null);
    const [curtido, setCurtido] = useState(false);

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
            setCurtido(data.curtidas.includes(userId));
        } catch (error) {
            console.error('Erro ao buscar detalhes do livro:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleCurtir = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.log('Token não encontrado');
                return;
            }

            const response = await fetch(`${API_DEV_URL}/livro/${livroId}/curtir/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setCurtido(!curtido);
                await fetchLivroDetalhes(); // Atualiza os dados do livro, incluindo o número de curtidas
            } else {
                Alert.alert('Erro', 'Erro ao curtir/descurtir o livro.');
            }
        } catch (error) {
            console.error('Erro ao curtir/descurtir o livro:', error);
        }
    };

    const handleSolicitarTroca = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.log('Token não encontrado');
                return;
            }

            const response = await fetch(`${API_DEV_URL}/chat-requests/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuarioDestino: livro.perfil_id,
                    livro: livroId,
                    mensagem: 'Gostaria de solicitar a troca deste livro.',
                }),
            });

            if (response.ok) {
                Alert.alert('Solicitação Enviada', 'Sua solicitação de troca foi enviada com sucesso!');
            } else {
                Alert.alert('Erro', 'Livro Indisponivel para Troca');
            }
        } catch (error) {
            console.error('Erro ao solicitar a troca:', error);
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
                {authenticatedUserId !== livro.perfil_id && livro.disponibilidade && (
                    <TouchableOpacity
                        style={styles.requestExchangeButton}
                        onPress={handleSolicitarTroca}
                    >
                        <Text style={styles.requestExchangeButtonText}>Solicitar Troca</Text>
                    </TouchableOpacity>
                )}
                <View style={styles.likeContainer}>
                    <TouchableOpacity onPress={handleCurtir}>
                        <Icon
                            name={curtido ? "heart" : "heart-outline"}
                            size={30}
                            color={curtido ? "#e74c3c" : "#fff"}
                        />
                    </TouchableOpacity>
                    <Text style={styles.likeCount}>{livro.curtidas.length} curtidas</Text>
                </View>
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
    requestExchangeButton: {
        backgroundColor: '#27ae60',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    requestExchangeButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    likeCount: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 10,
    },
});
