import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { API_BASE_URL } from '@env';
import { API_DEV_URL } from '@env';
import {
    View,
    Text,
    FlatList,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles'; 

interface Livro {
    id: number;
    titulo: string;
    autor: string;
    paginas: number;
    editora: string;
    descricao: string;
    dataPublicacao: string;
    dono: number;
    capa?: string | null;
}

export default function ListLivro() {
    const [livros, setLivros] = useState<Livro[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation(); 

    const fetchLivros = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/livro/`);
            console.log(`${API_BASE_URL}/livro`)
            const data = await response.json();
            setLivros(data);
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
        } finally {
            setLoading(false);
        }
    };

    // Carrega os livros na montagem do componente
    React.useEffect(() => {
        fetchLivros();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchLivros();
        setRefreshing(false);
    };

    const checkAuthAndNavigate = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            navigation.navigate('CreateLivro'); 
        } else {
            Alert.alert("Acesso negado", "Você precisa estar autenticado para criar um livro.");
        }
    };

    const renderItem = ({ item }: { item: Livro }) => (
        <TouchableOpacity 
            style={styles.bookCard} 
            onPress={() => navigation.navigate('LivroDetail', { livroId: item.id })}
        >
            <Text style={styles.bookTitle}>{item.titulo}</Text>
            {item.capa ? (
                <Image source={{ uri: item.capa }} style={styles.bookImage} />
            ) : (
                <Text style={styles.noImageText}>Sem capa disponível</Text>
            )}
            <Text>Autor: {item.autor}</Text>
            <Text>Páginas: {item.paginas}</Text>
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
            <FlatList
                data={livros}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                numColumns={2}
                columnWrapperStyle={styles.row}
                ListEmptyComponent={<Text>Nenhum livro disponível no momento.</Text>}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#0000ff']}
                    />
                }
            />
        </View>
    );
}
