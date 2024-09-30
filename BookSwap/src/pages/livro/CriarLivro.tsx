import React, { useState, useEffect } from 'react';
import { API_BASE_URL, API_DEV_URL } from '@env';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdicionarLivro({ navigation }: any) {
    // Estados para armazenar os dados do formulário
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [paginas, setPaginas] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataPublicacao, setDataPublicacao] = useState('');
    const [editora, setEditora] = useState('');
    const [capa, setCapa] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState('');

    // Função para pegar o token JWT e ID do usuário
    const getUserTokenAndId = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken'); // Token JWT salvo anteriormente
            const userId = await AsyncStorage.getItem('userId'); // Assumindo que o ID do usuário esteja salvo
            if (userToken && userId) {
                setToken(userToken);
                setUserId(userId);
            } else {
                Alert.alert('Erro', 'Usuário não autenticado.');
                navigation.goBack();
            }
        } catch (error) {
            console.error('Erro ao pegar token e ID do usuário:', error);
        }
    };

    // Executa ao montar o componente
    useEffect(() => {
        getUserTokenAndId();
    }, []);

    // Função para criar o livro
    const criarLivro = async () => {
        if (!titulo || !autor || !paginas || !editora || !descricao || !dataPublicacao) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        setLoading(true);

        try {
            console.log("prod: "+`${API_BASE_URL}/livro/`)
            console.log("dev: "+`${API_DEV_URL}/livro/`)
            const response = await fetch(`${API_DEV_URL}/livro/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Autenticação com JWT
                },
                body: JSON.stringify({
                    titulo,
                    autor,
                    paginas: Number(paginas), // Converter páginas para número
                    descricao,
                    dataPublicacao,
                    editora,
                    capa: capa || null, // Se não houver capa, enviar null
                    dono: Number(userId), // ID do usuário autenticado
                }),
                
            });


            if (response.ok) {
                Alert.alert('Sucesso', 'Livro criado com sucesso!');
                // Limpar os campos após a criação
                setTitulo('');
                setAutor('');
                setPaginas('');
                setDescricao('');
                setDataPublicacao('');
                setEditora('');
                setCapa('');
                // Navegar de volta para a lista de livros
                navigation.goBack();
            } else {
                const errorData = await response.json();
                console.error('Erro ao criar livro:', errorData);
                Alert.alert('Erro', 'Falha ao criar o livro. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao enviar requisição:', error);
            Alert.alert('Erro', 'Erro na comunicação com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Adicionar Novo Livro</Text>

            <TextInput
                style={styles.input}
                placeholder="Título"
                value={titulo}
                onChangeText={setTitulo}
            />
            <TextInput
                style={styles.input}
                placeholder="Autor"
                value={autor}
                onChangeText={setAutor}
            />
            <TextInput
                style={styles.input}
                placeholder="Páginas"
                value={paginas}
                onChangeText={setPaginas}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Descrição"
                value={descricao}
                onChangeText={setDescricao}
            />
            <TextInput
                style={styles.input}
                placeholder="Data de Publicação (YYYY-MM-DD)"
                value={dataPublicacao}
                onChangeText={setDataPublicacao}
            />
            <TextInput
                style={styles.input}
                placeholder="Editora"
                value={editora}
                onChangeText={setEditora}
            />
            <TextInput
                style={styles.input}
                placeholder="URL da Capa (opcional)"
                value={capa}
                onChangeText={setCapa}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Criar Livro" onPress={criarLivro} />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
});
