import React, { useState } from "react";
import {
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { StyleSheet } from "react-native";
import Logo from "../../assets/Logo.png";
import { API_DEV_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Login() {
    const navigation = useNavigation(); 
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!usuario || !senha) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_DEV_URL}/login/`, {
                username: usuario,
                password: senha,
            });

            if (response.status === 200) {
                const data = response.data;

                // Salva o token e outros dados no AsyncStorage
                await AsyncStorage.setItem('token', data.access);

                Alert.alert("Sucesso", "Login realizado com sucesso!");
                navigation.navigate('Main');
            }
        } catch (error) {
            console.error("Erro:", error);
            if (error.response) {
                // Erro retornado pela API
                const message = error.response.data.message || "Login falhou, verifique suas credenciais.";
                Alert.alert("Erro", message);
            } else {
                // Erro de rede ou outros
                Alert.alert("Erro", "Ocorreu um erro ao se conectar ao servidor.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={styles.logoContainer}>
                <Image source={Logo} style={styles.logo} />
                <Text style={styles.title}>BOOK SWAP</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.label}>Usuário</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite aqui seu Usuário"
                    value={usuario}
                    onChangeText={setUsuario}
                />
                <Text style={styles.label}>Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite aqui sua senha"
                    secureTextEntry={true}
                    value={senha}
                    onChangeText={setSenha}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Entrando..." : "Entrar"}</Text>
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>Ou</Text>
                <View style={styles.separatorLine} />
            </View>

            <View style={styles.bottomContainer}>
                <Text style={styles.loginText}>
                    Não tem uma conta?{' '}
                    <Text style={styles.loginLink} onPress={() => navigation.navigate('Registro')}>
                        Cadastre-se
                    </Text>
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A2B45',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60, // Abaixar a logo
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 10,
    },
    formContainer: {
        marginTop: 40, // Espaçamento entre logo e inputs
    },
    label: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        color: '#A8DADC',
        marginBottom: 20,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#3C5A99',
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
        justifyContent: 'center',
        marginVertical: 10,
    },
    separatorLine: {
        height: 1,
        width: '40%',
        backgroundColor: '#FF6347',
    },
    separatorText: {
        color: '#fff',
        fontSize: 16,
        marginHorizontal: 10,
    },
    bottomContainer: {
        alignItems: 'center',
        marginBottom: 30, // Espaçamento inferior
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
