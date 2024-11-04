import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl, SectionList, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { useNavigation } from '@react-navigation/native'; // Importando para navegação
import { API_DEV_URL } from '@env';

interface ChatRequest {
    id: string;
    usuario: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
    };
    usuarioDestino: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
    };
    livro: {
        titulo: string;
        autor: string;
    };
    mensagem: string;
    aceito: boolean;
    dataCriacao: string;
}

export default function ChatRequestsScreen() {
    const [sentRequests, setSentRequests] = useState<ChatRequest[]>([]);
    const [receivedRequests, setReceivedRequests] = useState<ChatRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [authenticatedUserId, setAuthenticatedUserId] = useState<number | null>(null);
    const navigation = useNavigation(); // Usando o hook de navegação

    useEffect(() => {
        fetchUserId();
    }, []);

    useEffect(() => {
        if (authenticatedUserId) {
            fetchChatRequests();
        }
    }, [authenticatedUserId]);

    const fetchUserId = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;
            const decodedToken = jwtDecode<{ user_id: number }>(token);
            setAuthenticatedUserId(decodedToken.user_id);
        } catch (error) {
            console.error('Erro ao buscar o ID do usuário:', error);
        }
    };

    const fetchChatRequests = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${API_DEV_URL}/chat-requests/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const sent = data.filter((request: ChatRequest) => request.usuario.id === authenticatedUserId);
                const received = data.filter((request: ChatRequest) => request.usuarioDestino.id === authenticatedUserId);
                setSentRequests(sent);
                setReceivedRequests(received);
            } else {
                Alert.alert('Erro', 'Erro ao buscar as solicitações de chat.');
            }
        } catch (error) {
            console.error('Erro ao buscar as solicitações de chat:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchChatRequests();
    };

    const handleAcceptRequest = async (requestId: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${API_DEV_URL}/chat-requests/${requestId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ aceito: true }),
            });

            if (response.ok) {
                Alert.alert('Sucesso', 'Solicitação aceita.');
                onRefresh(); // Atualiza a lista
            } else {
                Alert.alert('Erro', 'Erro ao aceitar a solicitação.');
            }
        } catch (error) {
            console.error('Erro ao aceitar a solicitação:', error);
        }
    };

    const handleRejectRequest = async (requestId: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${API_DEV_URL}/chat-requests/${requestId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ aceito: false }),
            });

            if (response.ok) {
                Alert.alert('Sucesso', 'Solicitação rejeitada.');
                onRefresh(); // Atualiza a lista
            } else {
                Alert.alert('Erro', 'Erro ao rejeitar a solicitação.');
            }
        } catch (error) {
            console.error('Erro ao rejeitar a solicitação:', error);
        }
    };

    const navigateToChat = (chatRequest: ChatRequest) => {
        if (chatRequest.aceito && chatRequest.chat) {
            navigation.navigate('Conversations', { chatId: chatRequest.chat }); // Passe o ID do chat aqui
        } else {
            Alert.alert('Aviso', 'A solicitação ainda não foi aceita ou o chat não foi criado.');
        }
    };

    const renderChatRequest = ({ item }: { item: ChatRequest }) => (
        <View style={styles.requestContainer}>
            <Text style={styles.requestTitle}>Livro: {item.livro.titulo}</Text>
            <Text style={styles.requestText}>Autor: {item.livro.autor}</Text>
            <Text style={styles.requestText}>Solicitante: {item.usuario.first_name} {item.usuario.last_name} ({item.usuario.username})</Text>
            <Text style={styles.requestText}>Destinatário: {item.usuarioDestino.first_name} {item.usuarioDestino.last_name} ({item.usuarioDestino.username})</Text>
            <Text style={styles.requestText}>Mensagem: {item.mensagem}</Text>
            <Text style={styles.statusText}>
                Status: {item.aceito ? <Text style={styles.accepted}>Aceito</Text> : <Text style={styles.pending}>Pendente</Text>}
            </Text>
            {item.usuarioDestino.id === authenticatedUserId && !item.aceito && (
                <View style={styles.buttonContainer}>
                    <Button title="Aceitar" onPress={() => handleAcceptRequest(item.id)} />
                    <Button title="Rejeitar" onPress={() => handleRejectRequest(item.id)} color="#e74c3c" />
                </View>
            )}
            {item.aceito && (
                <TouchableOpacity style={styles.chatButton} onPress={() => navigateToChat(item)}>
                    <Text style={styles.chatButtonText}>Ir para o Chat</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <SectionList
            sections={[
                { title: 'Solicitações Enviadas', data: sentRequests },
                { title: 'Solicitações Recebidas', data: receivedRequests }
            ]}
            keyExtractor={(item) => item.id}
            renderItem={renderChatRequest}
            renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.sectionHeader}>{title}</Text>
            )}
            contentContainerStyle={styles.listContainer}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#FF6347']}
                />
            }
        />
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 10,
    },
    requestContainer: {
        backgroundColor: '#f1f1f1',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        paddingTop: 10,
        paddingBottom: 5,
        backgroundColor: '#e0e0e0',
        paddingHorizontal: 10,
    },
    requestTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    requestText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
    },
    statusText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    accepted: {
        color: '#27ae60',
    },
    pending: {
        color: '#f39c12',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    chatButton: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    chatButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
});
