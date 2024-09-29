import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { API_BASE_URL, API_DEV_URL } from '@env';
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
import { StackNavigationProp } from '@react-navigation/stack';  // Import para tipagem
import { styles } from './styles'; 

// Defina as rotas do seu app
type RootStackParamList = {
    LivroDetail: { livroId: number };  // Rota e os parâmetros
    // Adicione outras rotas se necessário
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LivroDetail'>;

// Definição da interface Livro
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
    const [error, setError] = useState<string | null>(null);
    
    const navigation = useNavigation<HomeScreenNavigationProp>(); // Tipagem correta para navegação

    const fetchLivros = async () => {
        try {
            setError(null);
            const response = await fetch(`${API_DEV_URL}/livro/`);
            const data = await response.json();
            setLivros(data);
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            setError('Erro ao buscar livros. Verifique sua conexão e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchLivros();
    }, []);

    React.useEffect(() => {
        navigation.setOptions({
            headerShown: false, 
        });
    }, [navigation]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchLivros();
        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: Livro }) => (
        <TouchableOpacity 
            style={styles.bookCard} 
            onPress={() => navigation.navigate('LivroDetail', { livroId: item.id })} // Navegação corrigida
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

    if (loading && !refreshing) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

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

            {refreshing && (
                <View style={styles.loadingIndicator}>
                    <ActivityIndicator size="small" color="#2c3e51" />
                </View>
            )}
        </View>
    );
}
