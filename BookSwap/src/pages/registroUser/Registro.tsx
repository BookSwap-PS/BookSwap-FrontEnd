import React, { useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Alert,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    ScrollView
} from "react-native";
import { useNavigation } from '@react-navigation/native'; // Importe o hook de navegação
import { API_BASE_URL } from '@env';
import { API_DEV_URL } from '@env';

export default function Registro() {
    const navigation = useNavigation(); // Use o hook de navegação

    const [nome, setNome] = useState("");
    const [ultimoNome, setUltimoNome] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    // Função para lidar com o cadastro de usuário
    const handleRegister = async () => {
        if (!nome || !ultimoNome || !username || !email || !senha || !confirmarSenha) {
            Alert.alert("Erro", "Todos os campos são obrigatórios.");
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }

        try {
            
            const response = await fetch(`${API_BASE_URL}/usuario/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: nome,
                    last_name: ultimoNome,
                    username: username,
                    email: email,
                    password: senha,
                }),
            });
            console.log(`${API_BASE_URL}/usuario/`)

            if (response.ok) {
                Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
                navigation.navigate('Login'); // Redirecionar para a página de Login
            } else {
                const data = await response.json();
                Alert.alert("Erro", data.detail || "Falha ao cadastrar usuário.");
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao se conectar ao servidor.");
        }
    };

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.logoContainer}>
                    <Image source={require('../../assets/Logo.png')} style={styles.logo} />
                    <Text style={styles.title}>Cadastrar</Text>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Digite aqui seu Nome"
                    value={nome}
                    onChangeText={setNome}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Digite aqui seu Último Nome"
                    value={ultimoNome}
                    onChangeText={setUltimoNome}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Digite aqui seu Username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Digite aqui seu E-mail"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Digite aqui sua Senha"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirme sua Senha"
                    secureTextEntry
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                />

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>

                <View style={styles.separatorContainer}>
                    <Text style={styles.separatorText}>Ou</Text>
                </View>

                <View style={styles.socialButtonsContainer}>
                    <TouchableOpacity style={styles.socialButton}>
                        {/* <Image source={require('../../assets/google.png')} style={styles.socialIcon} /> */}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        {/* <Image source={require('../../assets/facebook.png')} style={styles.socialIcon} /> */}
                    </TouchableOpacity>
                </View>

                <Text style={styles.loginText}>
                    Já tem uma conta?{' '}
                    <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                        Entrar
                    </Text>
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A2B45',
    },
    scrollContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 10,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#0066FF',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    separatorText: {
        color: '#fff',
        fontSize: 16,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
        marginBottom: 20,
    },
    socialButton: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 50,
    },
    socialIcon: {
        width: 30,
        height: 30,
    },
    loginText: {
        color: '#fff',
        fontSize: 16,
    },
    loginLink: {
        color: '#FF6347',
        fontWeight: 'bold',
    },
});
