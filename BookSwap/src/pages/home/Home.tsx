import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Animated,
    Image,
    ActivityIndicator
} from 'react-native';

// Definir a interface para o tipo de livro
interface Livro {
    id: number;
    titulo: string;
    autor: string;
    paginas: number;
    editora: string;
    capa?: string | null;
}

export default function Home() {
    const [livros, setLivros] = useState<Livro[]>([]); // Tipar o estado como uma lista de 'Livro'
    const [loading, setLoading] = useState(true);
    const fadeAnim = new Animated.Value(0); // Inicialmente invisível

    // Função para buscar livros da API
    const fetchLivros = async () => {
        try {
            const response = await fetch('http://10.10.31.132:8000/livro/');
            const data = await response.json();
            console.log('Livros buscados:', data); // Log para verificar os dados
            setLivros(data);
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
        } finally {
            setLoading(false);
        }
    };

    // useEffect para buscar os livros quando o componente for montado
    useEffect(() => {
        fetchLivros();

        // Iniciar animação após 2 segundos (2000ms)
        setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 1, // Fica visível
                duration: 1000, // Duração da animação
                useNativeDriver: true,
            }).start();
        }, 2000); // Aguarda 2 segundos antes de começar a animação
    }, []);

    // Renderiza um item da lista de livros
    const renderItem = ({ item }: { item: Livro }) => ( // Tipar 'item' como 'Livro'
        <View style={styles.bookCard}>
            <Text style={styles.bookTitle}>{item.titulo}</Text>
            <Text>Autor: {item.autor}</Text>
            <Text>Páginas: {item.paginas}</Text>
            <Text>Editora: {item.editora}</Text>
            {item.capa && (
                <Image source={{ uri: item.capa }} style={styles.bookImage} />
            )}
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
            <Text style={styles.welcomeText}>Bem-vindo ao Book Swap!</Text>

            {livros.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum livro disponível no momento.</Text>
            ) : (
                <Animated.View style={[styles.listContainer, { opacity: fadeAnim }]}>
                    <FlatList
                        data={livros}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                    />
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#888',
    },
    listContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 20,
    },
    bookCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    bookImage: {
        width: 100,
        height: 150,
        marginTop: 10,
    },
});
