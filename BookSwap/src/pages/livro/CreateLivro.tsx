import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { API_DEV_URL } from '@env';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateLivro() {
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [editora, setEditora] = useState('');
    const [genero, setGenero] = useState('');
    const [descricao, setDescricao] = useState('');
    const [paginas, setPaginas] = useState('');
    const [dataPublicacao, setDataPublicacao] = useState<string | null>(null);
    const [condicao, setCondicao] = useState('');
    const [capa, setCapa] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSave = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert("Erro", "Você precisa estar autenticado para adicionar um livro.");
            return;
        }

        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('autor', autor);
        formData.append('editora', editora);
        formData.append('genero', genero);
        formData.append('descricao', descricao);
        formData.append('paginas', paginas);
        formData.append('dataPublicacao', dataPublicacao || '');

        if (capa) {
            const uriParts = capa.split('.');
            const fileType = uriParts[uriParts.length - 1];
            formData.append('capa', {
                uri: capa,
                name: `capa.${fileType}`,
                type: `image/${fileType}`,
            } as any);
        }

        try {
            const response = await fetch(`${API_DEV_URL}/livro/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert("Sucesso", "Livro criado com sucesso!");
                // Resetar os campos
                setTitulo('');
                setAutor('');
                setEditora('');
                setGenero('');
                setDescricao('');
                setPaginas('');
                setDataPublicacao(null);
                setCapa(null);
                setCondicao('');
            } else {
                Alert.alert("Erro", data.detail || JSON.stringify(data));
            }
        } catch (error) {
            const errorMessage = (error as Error).message;
            Alert.alert("Erro", `Erro ao criar o livro: ${errorMessage}`);
        }
    };

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || new Date();
        setShowDatePicker(Platform.OS === 'ios');

        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        setDataPublicacao(`${day}-${month}-${year}`);
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permissão Necessária", "Você precisa permitir o acesso à galeria para selecionar uma imagem.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setCapa(result.assets[0].uri);
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

                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                    <Ionicons name="image-outline" size={24} color="#1f2a44" />
                    <Text style={styles.uploadButtonText}>Adicionar capa do livro</Text>
                </TouchableOpacity>

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
        width: 200,
        height: 300,
        alignSelf: 'center',
        marginBottom: 15,
        borderRadius: 10,
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    radioTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    radioButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    novo: {
        backgroundColor: '#66ff66',
    },
    seminovo: {
        backgroundColor: '#ffff66',
    },
    usado: {
        backgroundColor: '#ff6666',
    },
    radioText: {
        fontWeight: 'bold',
        color: '#1f2a44',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#ff6666',
        padding: 15,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#66ff66',
        padding: 15,
        borderRadius: 10,
        flex: 1,
    },
    saveButtonText: {
        color: '#1f2a44',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});