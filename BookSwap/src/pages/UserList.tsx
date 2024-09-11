import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Definir as rotas possíveis da navegação
type RootStackParamList = {
    UserList: undefined;
    Login: undefined;
};

// Tipagem específica para o tipo de navegação
type UserListScreenProp = StackNavigationProp<RootStackParamList, 'UserList'>;

interface Usuario {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

export default function UserList() {
    const navigation = useNavigation<UserListScreenProp>();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsuarios = async () => {
        try {
            const response = await fetch('http://10.10.31.132:8000/usuario/');
            const data: Usuario[] = await response.json();
            setUsuarios(data);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar usuários: ", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const renderItem = ({ item }: { item: Usuario }) => (
        <View style={styles.userCard}>
            <Text style={styles.username}>Username: {item.username}</Text>
            <Text>Nome: {item.first_name} {item.last_name}</Text>
            <Text>Email: {item.email}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>Carregando...</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={usuarios}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Login')} // Navega para a página de login
                    >
                        <Text style={styles.buttonText}>Ir para Login</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    userCard: {
        padding: 20,
        marginVertical: 10,
        backgroundColor: '#f1f1f1',
        borderRadius: 12,
        borderColor: '#ddd',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    username: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#333',
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 25,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
});
