import React, { useState } from "react";
import {
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import Logo from "../../assets/Logo.png";
import { API_DEV_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';

// Definição de tipos para as rotas de navegação
type RootStackParamList = {
    Login: undefined;
    Main: undefined;
    Registro: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [usuario, setUsuario] = useState<string>("");
    const [senha, setSenha] = useState<string>("");

    const handleLogin = async () => {
        if (!usuario || !senha) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        try {
            const response = await fetch(`${API_DEV_URL}/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: usuario,
                    password: senha, 
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                await AsyncStorage.setItem('token', data.access);
                setUsuario(""); // Limpa o campo de usuário
                setSenha("");   // Limpa o campo de senha
                Alert.alert("Sucesso", "Login realizado com sucesso!");
                navigation.navigate('Main'); 
            } else {
                Alert.alert("Erro", data.message || "Login falhou, verifique suas credenciais.");
            }
        } catch (error) {
            console.error("Erro:", error);
            Alert.alert("Erro", "Ocorreu um erro ao se conectar ao servidor.");
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={styles.logoContainer}>
                <Image source={Logo} style={styles.logo} />
                <Text style={styles.title}>BOOK SWAP</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite aqui seu e-mail"
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
                <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
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
        marginTop: 60,
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
        marginTop: 40,
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
        marginBottom: 30,
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