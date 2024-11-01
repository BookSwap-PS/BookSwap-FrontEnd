import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, ScrollView, Platform, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL, API_DEV_URL } from '@env';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const EditLivro = ({ route, navigation }) => {
    const { livroId } = route.params;
    const [livro, setLivro] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [editora, setEditora] = useState('');
    const [genero, setGenero] = useState('');
    const [descricao, setDescricao] = useState('');
    const [paginas, setPaginas] = useState('');
    const [dataPublicacao, setDataPublicacao] = useState('');
    const [condicao, setCondicao] = useState('');
    const [disponibilidade, setDisponibilidade] = useState(false);
    const [capa, setCapa] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLivroData();
    }, []);

    const fetchLivroData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.log('Token não encontrado');
                return;
            }

            const apiUrl = API_BASE_URL || API_DEV_URL; // Alterna entre produção e desenvolvimento
            const response = await fetch(`${apiUrl}/livro/${livroId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setLivro(data);
                setTitulo(data.titulo);
                setAutor(data.autor);
                setEditora(data.editora);
                setGenero(data.genero);
                setDescricao(data.descricao);
                setPaginas(data.paginas.toString());
                setDataPublicacao(data.dataPublicacao);
                setCondicao(data.condicao);
                setDisponibilidade(data.disponibilidade);
                setCapa(data.capa);
            } else {
                console.log('Erro ao buscar dados do livro:', data);
            }
        } catch (error) {
            console.log('Erro ao buscar dados do livro:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImagePick = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos.');
                return;
            }
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

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.log('Token não encontrado');
                return;
            }

            const formData = new FormData();
            formData.append('titulo', titulo);
            formData.append('autor', autor);
            formData.append('editora', editora);
            formData.append('genero', genero);
            formData.append('descricao', descricao);
            formData.append('paginas', paginas);
            formData.append('dataPublicacao', dataPublicacao);
            formData.append('condicao', condicao);
            formData.append('disponibilidade', disponibilidade);

            if (capa) {
                const uriParts = capa.split('.');
                const fileType = uriParts[uriParts.length - 1];
                formData.append('capa', {
                    uri: capa,
                    name: `capa.${fileType}`,
                    type: `image/${fileType}`,
                });
            }

            const apiUrl = API_BASE_URL || API_DEV_URL;
            const response = await fetch(`${apiUrl}/livro/${livroId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                Alert.alert('Sucesso', 'Livro atualizado com sucesso');
                navigation.goBack();
            } else {
                const data = await response.json();
                console.log('Erro ao atualizar livro:', data);
                Alert.alert('Erro', 'Não foi possível atualizar o livro');
            }
        } catch (error) {
            console.log('Erro ao atualizar livro:', error);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setShowDatePicker(Platform.OS === 'ios');

        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        setDataPublicacao(`${day}-${month}-${year}`); // Ajuste para DD-MM-YYYY
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2c3e51" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Editar Livro</Text>
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
                        onChange={(event, selectedDate) => handleDateChange(event, selectedDate)}
                        maximumDate={new Date()}
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Descrição"
                    placeholderTextColor="#a6a2a2"
                    value={descricao}
                    onChangeText={setDescricao}
                />

                {/* Seção de Disponibilidade */}
                <View style={styles.switchContainer}>
                    <Text style={styles.radioTitle}>Disponível para troca:</Text>
                    <Switch
                        value={disponibilidade}
                        onValueChange={(value) => setDisponibilidade(value)}
                    />
                    <Text style={styles.disponibilidadeText}>
                        {disponibilidade ? 'Disponível' : 'Indisponível'}
                    </Text>
                </View>

                <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
                    <Ionicons name="image-outline" size={24} color="#1f2a44" />
                    <Text style={styles.uploadButtonText}>Atualizar capa do livro</Text>
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
};

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
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    disponibilidadeText: {
        color: '#fff',
        marginLeft: 10,
        fontWeight: 'bold',
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
    loadingContainer: {
        flex: 1,
        backgroundColor: '#2c3e51',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default EditLivro;