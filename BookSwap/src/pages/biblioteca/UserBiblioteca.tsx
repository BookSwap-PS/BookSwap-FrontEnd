import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_DEV_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App'; // Ajuste o caminho conforme necessário

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

type UserBibliotecaScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LivroDetail'>;

const UserBiblioteca: React.FC = () => {
    const [livros, setLivros] = useState<Livro[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // Estado para o refresh
    const navigation = useNavigation<UserBibliotecaScreenNavigationProp>(); // Tipagem correta

    const fetchUserBooks = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_DEV_URL}/livro/?meus_livros=true`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setLivros(data);
        } catch (error) {
            console.error('Erro ao buscar livros do usuário:', error);
        } finally {
            setLoading(false);
            setRefreshing(false); // Para o ícone de refresh
        }
    };

    useEffect(() => {
        fetchUserBooks();  // Carrega os livros do usuário ao montar o componente
    }, []);

    const onRefresh = () => {
        setRefreshing(true); // Mostra o ícone de refresh
        fetchUserBooks(); // Atualiza os dados ao fazer refresh
    };

    const renderItem = ({ item }: { item: Livro }) => (
        <TouchableOpacity
            style={styles.bookCard}
            onPress={() => navigation.navigate('LivroDetail', { livroId: item.id })} // Navegando para LivroDetail
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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
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
                        onRefresh={onRefresh} // Chama a função de refresh
                        tintColor="#f9f9f9" // Cor do indicador de refresh
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
};

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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
});

export default UserBiblioteca;