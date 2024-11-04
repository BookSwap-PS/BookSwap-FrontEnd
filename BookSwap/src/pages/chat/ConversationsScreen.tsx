import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_DEV_URL } from '@env';

export default function ConversationsScreen({ route }) {
    const { chatId } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [ws, setWs] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUsernameAndConnectWebSocket = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    Alert.alert('Erro', 'Token não encontrado');
                    return;
                }

                const response = await fetch(`${API_DEV_URL}/get-username/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const userUsername = data.username;
                    setUsername(userUsername);
                    console.log(data)

                    const websocket = new WebSocket(`ws://192.168.15.7:8000/ws/chat?username=${userUsername}`);
                    setWs(websocket);

                    websocket.onopen = () => {
                        console.log('WebSocket Conectado');
                    };

                    websocket.onmessage = (e) => {
                        const data = JSON.parse(e.data);
                        if (data.chatId === chatId) {
                            setMessages((prevMessages) => [...prevMessages, data]);
                        }
                    };

                    websocket.onclose = () => {
                        console.log('WebSocket Desconectado');
                    };

                    websocket.onerror = (error) => {
                        console.error('Erro no WebSocket:', error);
                    };
                } else {
                    Alert.alert('Erro', 'Não foi possível obter o username');
                }
            } catch (error) {
                console.error('Erro ao conectar WebSocket:', error);
            }
        };

        fetchUsernameAndConnectWebSocket();

        return () => {
            if (ws) ws.close();
        };
    }, []);

    const sendMessage = () => {
        if (newMessage && ws) {
            ws.send(JSON.stringify({
                chat: chatId,
                message: newMessage,
            }));
            setNewMessage('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.chatTitle}>Chat ID: {chatId}</Text>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.messageContainer,
                            item.sender_username === username ? styles.sentMessage : styles.receivedMessage,
                        ]}
                    >
                        <Text style={styles.sender}>{item.sender_username}:</Text>
                        <Text style={styles.message}>{item.message}</Text>
                        <Text style={styles.time}>{item.time}</Text>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    chatTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    messageContainer: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
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
    },
    message: {
        fontSize: 16,
    },
    time: {
        fontSize: 12,
        color: '#555',
        textAlign: 'right',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
});
