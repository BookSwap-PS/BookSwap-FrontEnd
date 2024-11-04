import React, { useEffect, useState } from 'react';
import { API_DEV_URL } from '@env'; // Mantém apenas a URL para o desenvolvimento
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

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

export default function UserLibraryScreen() {
    const [livros, setLivros] = useState<Livro[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    const fetchUserBooks = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_DEV_URL}/livro/?meus_livros=true`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Passa o token do usuário autenticado
                },
            });
            const data = await response.json();
            setLivros(data);
        } catch (error) {
            console.error('Erro ao buscar livros do usuário:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUserBooks();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchUserBooks();  // Carrega os livros do usuário ao montar o componente
    }, []);

    const renderItem = ({ item }: { item: Livro }) => (
        <View style={styles.bookCard}>
            <TouchableOpacity
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
                <Text>Editora: {item.editora}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditLivro', { livroId: item.id })}
            >
                <Icon name="pencil" size={20} color="#fff" />
                <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
        </View>
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
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#A9A9A9']}
                        tintColor={'#A9A9A9'}
                        progressBackgroundColor={'#F5F5F5'}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            Você ainda não possui nenhum livro cadastrado em sua biblioteca
                        </Text>
                    </View>
                }
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
    listContent: {
        paddingBottom: 80,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    bookCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        width: '48%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        marginBottom: 10,
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    bookImage: {
        width: '100%',
        height: 120,
        resizeMode: 'contain',
        marginTop: 10,
    },
    noImageText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#888',
        textAlign: 'center',
        marginTop: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3b5998',
        borderRadius: 10,
        padding: 20,
        marginVertical: 20,
    },
    emptyText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2980b9',
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 10,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
});