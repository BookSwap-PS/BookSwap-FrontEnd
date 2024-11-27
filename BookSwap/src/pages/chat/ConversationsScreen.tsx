import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_DEV_URL, API_CHAT_URL } from '@env';
import axios from 'axios';

export default function ConversationsScreen({ route }) {
    const { chatId } = route.params;
    const [messages, setMessages] = useState([]);
    const [chatTitle, setChatTitle] = useState('Carregando...');
    const [newMessage, setNewMessage] = useState('');
    const [ws, setWs] = useState(null);
    const [username, setUsername] = useState('');
    const [receiver, setReceiver] = useState('');
    const [trocaStatus, setTrocaStatus] = useState('');

    useEffect(() => {
        const fetchMessagesAndConnectWebSocket = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    Alert.alert('Erro', 'Token não encontrado');
                    return;
                }

                // Recuperar mensagens e título do chat
                const response = await axios.get(`${API_DEV_URL}/chats/${chatId}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    const data = response.data;
                    setMessages(data.mensagens);
                    setChatTitle(data.tituloTroca);
                } else {
                    Alert.alert('Erro', 'Não foi possível carregar o chat.');
                }

                // Recuperar username e conectar ao WebSocket
                const userResponse = await axios.get(`${API_DEV_URL}/get-username/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (userResponse.status === 200) {
                    const userData = userResponse.data;
                    setUsername(userData.username);
                    setReceiver(userData.receiver);

                    console.log(`ws://${API_CHAT_URL}/ws/chat/?username=${userData.username}`);
                    const websocket = new WebSocket(`ws://${API_CHAT_URL}/ws/chat/?username=${userData.username}`);
                    setWs(websocket);

                    websocket.onopen = () => console.log('WebSocket Conectado');
                    websocket.onmessage = (e) => {
                        const data = JSON.parse(e.data);

                        if (data.message && data.sender_username && data.time) {
                            setMessages((prevMessages) => {
                                const isDuplicate = prevMessages.some(
                                    (msg) =>
                                        msg.conteudo === data.message &&
                                        msg.quemEnviou === data.sender_username &&
                                        msg.dataEnvio === data.time
                                );

                                if (isDuplicate) {
                                    console.warn('Mensagem duplicada ignorada:', data);
                                    return prevMessages;
                                }

                                return [
                                    ...prevMessages,
                                    {
                                        quemEnviou: data.sender_username,
                                        conteudo: data.message,
                                        dataEnvio: data.time,
                                    },
                                ];
                            });
                        } else {
                            console.warn('Mensagem recebida com dados incompletos:', data);
                        }
                    };

                    websocket.onclose = () => console.log('WebSocket Desconectado');
                    websocket.onerror = (error) => console.error('Erro no WebSocket:', error);
                } else {
                    Alert.alert('Erro', 'Não foi possível obter o username.');
                }
            } catch (error) {
                console.error('Erro ao carregar mensagens:', error);
                Alert.alert('Erro', 'Falha ao conectar ao servidor.');
            }
        };

        fetchMessagesAndConnectWebSocket();

        return () => {
            if (ws) ws.close();
        };
    }, [chatId]);

    const sendMessage = () => {
        if (newMessage && ws) {
            const messageData = {
                chat: chatId,
                message: newMessage,
                sender_username: username,
                time: new Date().toISOString(),
            };

            ws.send(JSON.stringify(messageData));
            setNewMessage('');
        }
    };

    const concluirTroca = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Erro', 'Token não encontrado');
                return;
            }

            const response = await axios.post(
                `${API_DEV_URL}/concluir-troca/${chatId}/`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                const data = response.data;
                Alert.alert('Sucesso', data.mensagem);
                setTrocaStatus(data.mensagem.includes('concluída') ? 'Concluída' : 'Aguardando confirmação');
            } else {
                Alert.alert('Erro', 'Erro ao concluir a troca.');
            }
        } catch (error) {
            console.error('Erro ao concluir a troca:', error);
            Alert.alert('Erro', 'Falha ao conectar ao servidor.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.chatTitle}>{chatTitle}</Text>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.messageContainer,
                            item.quemEnviou === username ? styles.sentMessage : styles.receivedMessage,
                        ]}
                    >
                        <Text style={styles.sender}>
                            {item.quemEnviou === username ? 'Você' : item.quemEnviou}:
                        </Text>
                        <Text style={styles.message}>{item.conteudo}</Text>
                        <Text style={styles.time}>
                            {item.dataEnvio ? new Date(item.dataEnvio).toLocaleString() : 'Invalid Date'}
                        </Text>
                    </View>
                )}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                />
                <Button title="Enviar" onPress={sendMessage} />
            </View>
            {username === receiver && (
                <View style={styles.buttonContainer}>
                    <Button title="Concluir Troca" onPress={concluirTroca} color="#28a745" />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f9fa',
    },
    chatTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#343a40',
    },
    messageContainer: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    sentMessage: {
        backgroundColor: '#d4edda',
        alignSelf: 'flex-end',
    },
    receivedMessage: {
        backgroundColor: '#cce5ff',
        alignSelf: 'flex-start',
    },
    sender: {
        fontWeight: 'bold',
        marginBottom: 2,
        color: '#495057',
    },
    message: {
        fontSize: 16,
        color: '#212529',
    },
    time: {
        fontSize: 12,
        color: '#868e96',
        textAlign: 'right',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        borderColor: '#ced4da',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        marginTop: 10,
    },
});
