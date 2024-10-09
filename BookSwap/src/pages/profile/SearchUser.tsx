import React, { useEffect, useState } from 'react'; // Importando os hooks necessários do React
import { API_BASE_URL, API_DEV_URL } from '@env'; // Importando URLs base para API, dependendo do ambiente (produção ou desenvolvimento)
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando o AsyncStorage para acessar o token de autenticação
import {
    View, // Componente View para estruturar a UI
    Text, // Componente Text para renderizar textos
    StyleSheet, // Estilos para os componentes
    FlatList, // Componente FlatList para renderizar listas de dados
    Image, // Componente Image para exibir imagens
    ActivityIndicator, // Componente ActivityIndicator para mostrar um indicador de carregamento
    TouchableOpacity, // Componente TouchableOpacity para criar áreas clicáveis
    TextInput, // Componente TextInput para entrada de texto
    RefreshControl, // Componente RefreshControl para controlar a atualização da lista
} from 'react-native'; // Importando componentes essenciais do React Native

// Definindo a interface do tipo Usuario para garantir que cada usuário tenha as propriedades esperadas
interface Usuario {
    id: number; // ID do usuário
    first_name: string; // Primeiro nome do usuário
    last_name: string; // Sobrenome do usuário
    username: string; // Nome de usuário (username)
    email: string; // E-mail do usuário
    image?: string | null; // Imagem de perfil do usuário (pode ser nula)
}

// Componente principal da função, responsável pela tela de busca de usuários
export default function SearchUser() {
    // Estado que armazena a lista de usuários buscados
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    // Estado que indica se os dados estão sendo carregados
    const [loading, setLoading] = useState(true);
    // Estado que indica se a lista está sendo atualizada com um "pull-to-refresh"
    const [refreshing, setRefreshing] = useState(false);
    // Estado que armazena a consulta de busca digitada pelo usuário
    const [searchQuery, setSearchQuery] = useState('');

    // Definindo a URL da API dependendo do ambiente (desenvolvimento ou produção)
    const apiUrl = process.env.NODE_ENV === 'development' ? API_DEV_URL : API_BASE_URL;

    // Função responsável por buscar os usuários na API, com a consulta de pesquisa opcional
    const fetchUsuarios = async (query: string = '') => {
        try {
            setLoading(true); // Ativando o indicador de carregamento
            const token = await AsyncStorage.getItem('token'); // Obtendo o token de autenticação do AsyncStorage

            // Verificando se o token foi encontrado, se não, exibe uma mensagem de erro no console
            if (!token) {
                console.log('Token não encontrado');
                return;
            }

            // Definindo a URL para buscar os usuários. Se houver uma query de busca, ela é adicionada à URL
            let url = `${apiUrl}/usuario/`;
            if (query) {
                url += `?search=${query}`; // Adicionando a query de busca à URL
            }

            // Realizando a requisição GET para a API
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Incluindo o token de autenticação no cabeçalho
                    'Content-Type': 'application/json', // Definindo o tipo de conteúdo como JSON
                },
            });

            // Se a resposta for bem-sucedida, os dados dos usuários são convertidos para JSON e armazenados no estado
            if (response.ok) {
                const data = await response.json(); // Convertendo a resposta para JSON
                setUsuarios(data); // Armazenando os usuários no estado
            } else {
                // Se ocorrer um erro, exibe a mensagem de erro no console
                console.error('Erro ao buscar usuários:', await response.json());
            }
        } catch (error) {
            // Capturando e exibindo erros que podem ocorrer durante a requisição
            console.error('Erro ao buscar usuários:', error);
        } finally {
            // Independente do resultado, o carregamento é desativado
            setLoading(false);
        }
    };

    // Função chamada quando o usuário realiza o "pull-to-refresh"
    const onRefresh = async () => {
        setRefreshing(true); // Ativando o indicador de atualização
        await fetchUsuarios(); // Recarregando a lista de usuários
        setRefreshing(false); // Desativando o indicador de atualização
    };

    // Hook useEffect que é executado uma vez quando o componente é montado para buscar os usuários inicialmente
    useEffect(() => {
        fetchUsuarios(); // Chamando a função para buscar os usuários na montagem do componente
    }, []); // Array vazio indica que isso só será executado uma vez

    // Função chamada quando o botão de busca é pressionado
    const handleSearch = () => {
        fetchUsuarios(searchQuery); // Fazendo a busca com a query do campo de texto
    };

    // Função responsável por renderizar cada item da lista de usuários
    const renderItem = ({ item }: { item: Usuario }) => (
        <TouchableOpacity style={styles.userCard}>
            {/* Verifica se o usuário tem uma imagem de perfil. Se tiver, exibe a imagem. Caso contrário, exibe um placeholder */}
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.profileImage} />
            ) : (
                <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>Sem Imagem</Text>
                </View>
            )}
            {/* Exibindo o nome completo e o nome de usuário */}
            <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
            <Text style={styles.username}>@{item.username}</Text>
        </TouchableOpacity>
    );

    // Verificando se os dados ainda estão sendo carregados. Se sim, mostra um indicador de carregamento
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" /> {/* Indicador de carregamento */}
            </View>
        );
    }

    // Retornando a interface principal do componente, com o campo de busca e a lista de usuários
    return (
        <View style={styles.container}>
            {/* Área de busca onde o usuário pode digitar o nome, sobrenome ou username */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por nome, sobrenome ou username..."
                    value={searchQuery} // Vinculando o estado do campo de busca ao componente
                    onChangeText={(text) => setSearchQuery(text)} // Atualizando o estado quando o texto mudar
                    onSubmitEditing={handleSearch} // Realizando a busca quando o usuário confirmar a entrada
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Buscar</Text> {/* Botão de busca */}
                </TouchableOpacity>
            </View>

            {/* Lista de usuários exibida após a busca */}
            <FlatList
                data={usuarios} // Definindo os dados a serem exibidos (lista de usuários)
                keyExtractor={(item) => item.id.toString()} // Definindo uma chave única para cada item (ID do usuário)
                renderItem={renderItem} // Função que renderiza cada item da lista
                contentContainerStyle={styles.listContent} // Estilos adicionais para o conteúdo da lista
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing} // Indicador de atualização da lista
                        onRefresh={onRefresh} // Função chamada ao fazer "pull-to-refresh"
                        colors={['#A9A9A9']} // Cores do indicador de atualização
                        tintColor={'#A9A9A9'} // Cor do indicador de carregamento
                        progressBackgroundColor={'#F5F5F5'} // Cor de fundo do indicador de carregamento
                    />
                }
                ListEmptyComponent={<Text>Nenhum usuário encontrado.</Text>} // Exibe essa mensagem se não houver usuários
            />
        </View>
    );
}

// Estilos para o componente
const styles = StyleSheet.create({
    container: {
        flex: 1, // Define que o componente deve ocupar todo o espaço disponível
        backgroundColor: '#1f2a44', // Cor de fundo do container
        paddingHorizontal: 20, // Definindo o espaçamento horizontal
        paddingTop: 20, // Definindo o espaçamento superior
    },
    searchContainer: {
        flexDirection: 'row', // Alinhando os elementos em linha (campo de texto e botão)
        marginBottom: 20, // Margem inferior
        alignItems: 'center', // Centralizando verticalmente os elementos
    },
    searchInput: {
        flex: 1, // Fazendo o campo de busca ocupar todo o espaço disponível
        backgroundColor: '#fff', // Cor de fundo do campo de busca
        borderRadius: 5, // Bordas arredondadas
        padding: 10, // Definindo o espaçamento interno
        fontSize: 16, // Tamanho da fonte
    },
    searchButton: {
        marginLeft: 10, // Margem à esquerda entre o campo de busca e o botão
        backgroundColor: '#007bff', // Cor de fundo do botão
        padding: 10, // Definindo o espaçamento interno do botão
        borderRadius: 5, // Bordas arredondadas
    },
    searchButtonText: {
        color: '#fff', // Cor do texto do botão
        fontWeight: 'bold', // Deixando o texto em negrito
    },
    listContent: {
        paddingBottom: 80, // Definindo o espaçamento inferior da lista
    },
    userCard: {
        backgroundColor: '#fff', // Cor de fundo dos cards de usuários
        borderRadius: 10, // Bordas arredondadas dos cards
        padding: 10, // Definindo o espaçamento interno dos cards
        marginBottom: 15, // Margem inferior entre os cards
        alignItems: 'center', // Centralizando o conteúdo dos cards
        shadowColor: '#000', // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Definindo a posição da sombra
        shadowOpacity: 0.1, // Opacidade da sombra
        shadowRadius: 3, // Raio da sombra
        elevation: 2, // Elevação do card para Android
    },
    profileImage: {
        width: 100, // Largura da imagem de perfil
        height: 100, // Altura da imagem de perfil
        borderRadius: 50, // Tornando a imagem circular
    },
    placeholderImage: {
        width: 100, // Largura do placeholder de imagem
        height: 100, // Altura do placeholder de imagem
        borderRadius: 50, // Tornando o placeholder circular
        backgroundColor: '#34495e', // Cor de fundo do placeholder
        alignItems: 'center', // Centralizando o texto no placeholder
        justifyContent: 'center', // Centralizando o texto verticalmente no placeholder
    },
    placeholderText: {
        color: '#fff', // Cor do texto do placeholder
        fontSize: 16, // Tamanho do texto
    },
    name: {
        fontSize: 18, // Tamanho da fonte do nome do usuário
        fontWeight: 'bold', // Negrito para o nome do usuário
        marginTop: 10, // Margem superior entre a imagem e o nome
        textAlign: 'center', // Centralizando o nome
    },
    username: {
        fontSize: 16, // Tamanho da fonte do username
        color: '#888', // Cor do texto do username
        textAlign: 'center', // Centralizando o username
    },
});
