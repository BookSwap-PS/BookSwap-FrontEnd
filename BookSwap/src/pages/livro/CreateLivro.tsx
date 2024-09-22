import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage para pegar o token
import { API_BASE_URL, API_DEV_URL } from '@env';

export default function CreateLivro() {
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [editora, setEditora] = useState('');
    const [genero, setGenero] = useState('');
    const [descricao, setDescricao] = useState('');
    const [paginas, setPaginas] = useState(''); // Campo para número de páginas
    const [dataPublicacao, setDataPublicacao] = useState(''); // Campo para data de publicação
    const [condicao, setCondicao] = useState('');
    const [capa, setCapa] = useState(null);

    const handleSave = async () => {
        // Recupera o token JWT do AsyncStorage
        const token = await AsyncStorage.getItem('token');
        
        if (!token) {
            Alert.alert("Erro", "Você precisa estar autenticado para adicionar um livro.");
            return;
        }

        try {
            console.log("prod: "+`${API_BASE_URL}/livro/`)
            console.log("dev: "+`${API_DEV_URL}/livro/`)
            const response = await fetch(`${API_DEV_URL}/livro/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Envia o token JWT no cabeçalho
                },
                body: JSON.stringify({
                    titulo,
                    autor,
                    editora,
                    genero,
                    descricao,
                    paginas: parseInt(paginas), // Envia o número de páginas como inteiro
                    dataPublicacao, // Envia a data de publicação
                    condicao,
                    capa, // Se houver uma URL de capa
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Sucesso", "Livro criado com sucesso!");
                // Limpa os campos após o sucesso
                setTitulo('');
                setAutor('');
                setEditora('');
                setGenero('');
                setDescricao('');
                setPaginas(''); // Limpa o campo de páginas
                setDataPublicacao(''); // Limpa o campo de data de publicação
                setCondicao('');
                setCapa(null);
            } else {
                // Exibe mensagens de erro retornadas pela API
                Alert.alert("Erro", data.detail || JSON.stringify(data));
            }
        } catch (error) {
            // Exibe erro de rede ou qualquer outro problema
            Alert.alert("Erro", `Erro ao criar o livro: ${error.message}`);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Adicionar Livro</Text>
                <Ionicons name="book-outline" size={60} color="#fff" style={styles.bookIcon} />
                
                {/* Campos de texto */}
                <TextInput
                    style={styles.input}
                    placeholder="Título do livro"
                    placeholderTextColor="#b0c4de"
                    value={titulo}
                    onChangeText={setTitulo}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Autor"
                    placeholderTextColor="#b0c4de"
                    value={autor}
                    onChangeText={setAutor}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Editora"
                    placeholderTextColor="#b0c4de"
                    value={editora}
                    onChangeText={setEditora}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Gênero"
                    placeholderTextColor="#b0c4de"
                    value={genero}
                    onChangeText={setGenero}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Número de páginas"
                    placeholderTextColor="#b0c4de"
                    keyboardType="numeric" // Define o teclado numérico
                    value={paginas}
                    onChangeText={setPaginas}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Data de Publicação (YYYY-MM-DD)"
                    placeholderTextColor="#b0c4de"
                    value={dataPublicacao}
                    onChangeText={setDataPublicacao}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Descrição"
                    placeholderTextColor="#b0c4de"
                    value={descricao}
                    onChangeText={setDescricao}
                />

                {/* Botão para adicionar capa */}
                <TouchableOpacity style={styles.uploadButton}>
                    <Ionicons name="image-outline" size={24} color="#1f2a44" />
                    <Text style={styles.uploadButtonText}>Adicionar capa do livro</Text>
                </TouchableOpacity>

                {/* Escolha de Condição */}
                <View style={styles.radioGroup}>
                    <Text style={styles.radioTitle}>Condição:</Text>
                    <TouchableOpacity onPress={() => setCondicao('novo')}>
                        <Text style={[styles.radioButton, condicao === 'novo' && styles.radioSelected]}>Novo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCondicao('seminovo')}>
                        <Text style={[styles.radioButton, condicao === 'seminovo' && styles.radioSelected]}>Seminovo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCondicao('usado')}>
                        <Text style={[styles.radioButton, condicao === 'usado' && styles.radioSelected]}>Usado</Text>
                    </TouchableOpacity>
                </View>

                {/* Botões de Ação */}
                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => Alert.alert('Cancelado')}>
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#1f2a44',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    bookIcon: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
    },
    uploadButtonText: {
        marginLeft: 10,
        color: '#1f2a44',
        fontWeight: 'bold',
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    radioTitle: {
        color: '#fff',
        fontWeight: 'bold',
    },
    radioButton: {
        color: '#fff',
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    radioSelected: {
        backgroundColor: '#4CAF50',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,  // Adiciona margem superior para garantir espaçamento entre os botões e o restante
    },
    cancelButton: {
        backgroundColor: '#F08080',
        padding: 15,
        borderRadius: 10,
        width: '45%',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        width: '45%',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
