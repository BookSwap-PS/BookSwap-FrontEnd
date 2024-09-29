import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL, API_DEV_URL } from '@env';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateLivro() {
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [editora, setEditora] = useState('');
    const [genero, setGenero] = useState('');
    const [descricao, setDescricao] = useState('');
    const [paginas, setPaginas] = useState('');
    const [dataPublicacao, setDataPublicacao] = useState('');
    const [condicao, setCondicao] = useState('');
    const [capa, setCapa] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSave = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert("Erro", "Você precisa estar autenticado para adicionar um livro.");
            return;
        }

        const formData = new FormData();

        // Adiciona todos os campos de texto ao FormData
        formData.append('titulo', titulo);
        formData.append('autor', autor);
        formData.append('editora', editora);
        formData.append('genero', genero);
        formData.append('descricao', descricao);
        formData.append('paginas', paginas);
        formData.append('dataPublicacao', dataPublicacao);
        formData.append('condicao', condicao);

        // Adiciona a imagem da capa, se houver
        if (capa) {
            const filename = capa.split('/').pop(); // Obtém o nome do arquivo
            const match = /\.(\w+)$/.exec(filename); // Extrai a extensão do arquivo
            const ext = match ? match[1] : 'jpg'; // Usa jpg por padrão, se não encontrar
            formData.append('capa', {
                uri: capa,
                name: `capa.${ext}`,
                type: `image/${ext}`,
            });
        }

        try {
            const response = await fetch(`${API_DEV_URL}/livro/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data', // Necessário para upload de arquivos
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Sucesso", "Livro criado com sucesso!");
                setTitulo('');
                setAutor('');
                setEditora('');
                setGenero('');
                setDescricao('');
                setPaginas('');
                setDataPublicacao('');
                setCondicao('');
                setCapa(null);
            } else {
                Alert.alert("Erro", data.detail || JSON.stringify(data));
            }
        } catch (error) {
            Alert.alert("Erro", `Erro ao criar o livro: ${error.message}`);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setShowDatePicker(Platform.OS === 'ios');

        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();

        setDataPublicacao(`${day}-${month}-${year}`);
    };

    const pickImage = async () => {
        let result = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (result.granted === false) {
            Alert.alert("Permissão Necessária", "Você precisa permitir o acesso à galeria para selecionar uma imagem.");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!pickerResult.cancelled) {
            setCapa(pickerResult.uri);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Adicionar Livro</Text>
                <Ionicons name="book-outline" size={60} color="#fff" style={styles.bookIcon} />

                <TextInput
                    style={styles.input}
                    placeholder="Título do livro"
                    placeholderTextColor="#a6a2a2"
                    value={titulo}
                    onChangeText={setTitulo}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Autor"
                    placeholderTextColor="#a6a2a2"
                    value={autor}
                    onChangeText={setAutor}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Editora"
                    placeholderTextColor="#a6a2a2"
                    value={editora}
                    onChangeText={setEditora}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Gênero"
                    placeholderTextColor="#a6a2a2"
                    value={genero}
                    onChangeText={setGenero}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Número de páginas"
                    placeholderTextColor="#a6a2a2"
                    keyboardType="numeric"
                    value={paginas}
                    onChangeText={setPaginas}
                />

                {/* Campo de Data de Publicação */}
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                    <Text style={{ color: dataPublicacao ? '#000' : '#a6a2a2' }}>
                        {dataPublicacao || 'Data de Publicação (DD-MM-YYYY)'}
                    </Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Descrição"
                    placeholderTextColor="#a6a2a2"
                    value={descricao}
                    onChangeText={setDescricao}
                />

                {/* Botão de adicionar capa */}
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                    <Ionicons name="image-outline" size={24} color="#1f2a44" />
                    <Text style={styles.uploadButtonText}>Adicionar capa do livro</Text>
                </TouchableOpacity>

                {/* Exibe a imagem selecionada */}
                {capa && <Image source={{ uri: capa }} style={styles.capaImage} />}

                <View style={styles.radioGroup}>
                    <Text style={styles.radioTitle}>Condição:</Text>
                    <TouchableOpacity onPress={() => setCondicao('novo')} style={[styles.radioButton, condicao === 'novo' && styles.novo]}>
                        <Text style={styles.radioText}>Novo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCondicao('seminovo')} style={[styles.radioButton, condicao === 'seminovo' && styles.seminovo]}>
                        <Text style={styles.radioText}>Seminovo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCondicao('usado')} style={[styles.radioButton, condicao === 'usado' && styles.usado]}>
                        <Text style={styles.radioText}>Usado</Text>
                    </TouchableOpacity>
                </View>

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
        justifyContent: 'center',
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
    capaImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 15,
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
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#fff',
    },
    radioText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    novo: {
        backgroundColor: '#4CAF50',
    },
    seminovo: {
        backgroundColor: '#FFEB3B',
    },
    usado: {
        backgroundColor: '#F44336',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
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
