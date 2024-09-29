import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_DEV_URL } from '@env';

interface Livro {
    titulo: string;
    capa: string;
    autor: string;
    paginas: number;
    editora: string;
    descricao: string;
    dataPublicacao: string;
    genero: string;
    condicao: string;
    dono: string;
}

interface LivroDetailProps {
    route: {
        params: {
            livroId: string;
        };
    };
}

export default function LivroDetail({ route }: LivroDetailProps) {
    const { livroId } = route.params; // Pega o ID passado pela navegação
    const [livro, setLivro] = useState<Livro | null>(null); // Tipo definido
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // Estado para controlar o refresh

    const fetchLivroDetalhes = async () => {
        try {
            const token = await AsyncStorage.getItem('token'); // Obtém o token JWT armazenado
            const response = await fetch(`${API_DEV_URL}/livro/${livroId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Inclui o token JWT no cabeçalho
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setLivro(data);
        } catch (error) {
            console.error('Erro ao buscar detalhes do livro:', error);
        } finally {
            setLoading(false);
            setRefreshing(false); // Para de indicar que está atualizando
        }
    };

    useEffect(() => {
        fetchLivroDetalhes();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchLivroDetalhes(); // Chama a função de fetch quando o usuário puxa para atualizar
    };

    if (loading) {
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
                    tintColor="#f9f9f9" // Cor do refresh
                />
            }
        >
            <Text style={styles.bookTitle}>{livro.titulo}</Text>
            {livro.capa ? (
                <Image source={{ uri: livro.capa }} style={styles.bookImage} />
            ) : (
                <Text style={styles.noImageText}>Sem capa disponível</Text>
            )}
            <Text>Autor: {livro.autor}</Text>
            <Text>Páginas: {livro.paginas}</Text>
            <Text>Editora: {livro.editora}</Text>
            <Text>Descrição: {livro.descricao}</Text>
            <Text>Publicado em: {livro.dataPublicacao}</Text>
            <Text>Gênero: {livro.genero}</Text>
            <Text>Condição: {livro.condicao}</Text>
            <Text>Dono: {livro.dono}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
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
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    bookImage: {
        width: 200,
        height: 300,
        resizeMode: 'contain',
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: '#e1e1e1',  // Placeholder background color
    },
    noImageText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#888',
        textAlign: 'center',
        marginBottom: 20,
    },
});
