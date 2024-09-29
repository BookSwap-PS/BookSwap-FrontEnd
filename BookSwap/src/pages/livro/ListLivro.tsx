import React, { useEffect, useState } from 'react';
import { API_DEV_URL } from '@env';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Defina as rotas e parâmetros
type RootStackParamList = {
    LivroDetail: { livroId: number };
};

type ListLivroScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LivroDetail'>;

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
    const [searchQuery, setSearchQuery] = useState('');
    
    const navigation = useNavigation<ListLivroScreenNavigationProp>();  // Use navegação tipada

    const fetchLivros = async (query: string = '') => {
        try {
            setLoading(true);
            let url = `${API_DEV_URL}/livro/`;
            if (query) {
                url += `?search=${query}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            setLivros(data);
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLivros();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchLivros();
        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: Livro }) => (
        <TouchableOpacity
            style={styles.bookCard}
            onPress={() => navigation.navigate('LivroDetail', { livroId: item.id })}  // Navegação corrigida
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
    );

    const handleSearch = () => {
        fetchLivros(searchQuery);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#2c3e51" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Campo de Busca */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por título..."
                    value={searchQuery}
                    onChangeText={(text: string) => setSearchQuery(text)}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Buscar</Text>
                </TouchableOpacity>
            </View>

            {/* Lista de Livros */}
            <FlatList
                data={livros}
                keyExtractor={(item: Livro) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                numColumns={2}
                columnWrapperStyle={styles.row}
                ListEmptyComponent={<Text>Nenhum livro disponível no momento.</Text>}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#f9f9f9']}
                    />
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
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    searchButton: {
        marginLeft: 10,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
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
});