import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_DEV_URL } from '@env';
import { jwtDecode } from 'jwt-decode';
import Icon from 'react-native-vector-icons/Ionicons'; // Importa o ícone de seta e coração
import CreateResenha from './CreateResenha';

export default function LivroDetail({ route, navigation }) {
    const { livroId } = route.params;
    const [livro, setLivro] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [authenticatedUserId, setAuthenticatedUserId] = useState(null);
    const [curtido, setCurtido] = useState(false);
    const [comentarioTexto, setComentarioTexto] = useState('');
    const [comentarios, setComentarios] = useState([]);

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
            setCurtido(data.curtidas.includes(userId));
        } catch (error) {
            console.error('Erro ao buscar detalhes do livro:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchComentarios = async () => {
        try{
            const token = await AsyncStorage.getItem('token');

            if (!token){
                console.log('Token não entcontrado');
                return;
            }

            const response = await fetch(`${API_DEV_URL}/comentario/?livro=${livroId}` , {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setComentarios(data);
        } catch (error) {
            console.error('Nenhum comentario encontrado');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchLivroDetalhes();
        await fetchComentarios();
        setRefreshing(false);

    };

    useEffect(() => {
        fetchLivroDetalhes();
        fetchComentarios();
    }, []);

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
                console.error('Erro ao curtir/descurtir o livro');
            }
        } catch (error) {
            console.error('Erro ao curtir/descurtir o livro:', error);
        }
    };

    const handleSubmitComentario = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.log('Token não encontrado');
                return;
            }

            const response = await fetch(`${API_DEV_URL}/comentario/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    livro: livroId,
                    texto: comentarioTexto,
                }),
            });

            if (response.ok) {
                setComentarioTexto('');
                await fetchLivroDetalhes(); // Atualiza a lista de comentários
            } else {
                const errorData = await response.json();
                console.error('Erro ao enviar comentário:', errorData);
            }
        } catch (error) {
            console.error('Erro ao enviar comentário:', error);
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
            // Alert.alert('Erro', 'Livro Indisponivel para Troca');
        }
    };


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
        <Text style={styles.bookTitle}>{livro.titulo}</Text>

        <View style={styles.header}>
            <View style={styles.topContainer}>
                <View style={styles.coverContainer}>
                    {livro.capa ? (
                        <Image source={{ uri: livro.capa }} style={styles.bookImage} />
                    ) : (
                        <Text style={styles.noImageText}>Sem capa disponível</Text>
                    )}
                </View>
                <View style={styles.buttonContainer}>
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
                            style={styles.ownerProfileButton}
                            onPress={() => navigation.navigate('UserProfile', { userId: livro.perfil_id })}
                        >
                            <Text style={styles.ownerProfileButtonText}>@{livro.dono}</Text>
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
                        <Text style={styles.likeCount}>{livro.curtidas ? livro.curtidas.length : 0} curtidas</Text>
                    </View>
                    {authenticatedUserId !== livro.perfil_id && livro.disponibilidade && (
                        <TouchableOpacity
                            style={styles.requestExchangeButton}
                            onPress={handleSolicitarTroca}
                        >
                            <Text style={styles.requestExchangeButtonText}>Solicitar Troca</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>


           

            <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>Autor: {livro.autor}</Text>
                <Text style={styles.detailText}>Páginas: {livro.paginas}</Text>
                <Text style={styles.detailText}>Editora: {livro.editora}</Text>
                <Text style={styles.detailText}>Descrição: {livro.descricao}</Text>
                <Text style={styles.detailText}>Publicado em: {livro.dataPublicacao}</Text>
                <Text style={styles.detailText}>Gênero: {livro.genero}</Text>
                <Text style={styles.detailText}>Condição: {livro.condicao}</Text>
                <Text style={styles.detailText}>Resenha: {livro.resenha}</Text>
            </View>

            

            <View style={styles.commentSection}>
                <Text style={styles.sectionTitle}>Comentários</Text>
                {comentarios.length > 0 ? (
                    comentarios.map((comentario) => (
                        <View key={comentario.id} style={styles.comment}>
                            <Text style={styles.commentAuthor}>{comentario.usuario}: {comentario.texto}</Text>
                        </View>
                    ))
                ) : (
                    <Text>Nenhum comentário ainda.</Text>
                )}

                <TextInput
                    style={styles.commentInput}
                    placeholder="Adicione um comentário..."
                    placeholderTextColor="#ccc"
                    value={comentarioTexto}
                    onChangeText={setComentarioTexto}
                />
                <TouchableOpacity style={styles.commentButton} onPress={handleSubmitComentario}>
                    <Text style={styles.commentButtonText}>Enviar Comentário</Text>
                </TouchableOpacity>
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
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 50,
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'flex-end',
        marginLeft: 20, // Ajuste o espaço entre a imagem e os botões
    },
    
    requestExchangeButton: {
        backgroundColor: '#27ae60',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginTop: 10, // Adiciona um espaço superior para ajustar o botão ao topo
    },

    requestExchangeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    bookTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        top: 27,
        left: 20,
        zIndex: 10,
        marginBottom: 20,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        marginBottom: 20,
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
        color: '#666',
    },
    coverContainer: {
        marginTop: 20,
        width: 180,
        height: 250,
        backgroundColor: '#3b5998',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 10,
    },
    detailsContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#22304f',
        borderRadius: 10,
        width: '100%',
    },
    detailText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#fff',
    },
    ownerButton: {
        backgroundColor: '#2980b9',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    ownerButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    ownerProfileButton: {
        backgroundColor: '#1abc9c',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    ownerProfileButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    requestExchangeButton: {
        backgroundColor: '#27ae60',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    requestExchangeButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 20,
        marginBottom: 20,
    },
    likeCount: {
        marginLeft: 10,
        fontSize: 18,
        color: '#fff',
    },
    commentSection: {
        marginTop: 20,
        width: '100%',
        backgroundColor: '#2c3e50',
        padding: 10,
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        marginTop: 10,
    },
    commentInput: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 20,
    },
    commentButton: {
        backgroundColor: '#2980b9',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    commentButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    commentAuthor:{
        color: '#fff',
        fontSize: 18,
    },
});
