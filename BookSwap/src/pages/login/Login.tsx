import React, { useState } from "react";
import {
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { style } from "./styles";
import Logo from "../../assets/Logo.png";
import { API_BASE_URL } from '@env';
import { API_DEV_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';

// Definição de tipos para as rotas de navegação
type RootStackParamList = {
    Login: undefined;      // Rota de Login
    Main: undefined;
    Registro: undefined;
    // Adicione outras rotas conforme necessário
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
    const navigation = useNavigation<LoginScreenNavigationProp>(); // Adicionando a tipagem de navegação

    const [usuario, setUsuario] = useState<string>(""); // Tipando o estado
    const [senha, setSenha] = useState<string>(""); // Tipando o estado

    const handleLogin = async () => {
        if (!usuario || !senha) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        try {
            console.log("prod: " + `${API_BASE_URL}/login/`);
            console.log("dev: " + `${API_DEV_URL}/login/`);

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
        <KeyboardAvoidingView 
            style={style.container}
            behavior="height"  
            keyboardVerticalOffset={30} 
        >
            <View style={style.boxTop}>
                <Image source={Logo} style={style.logo} />
                <Text style={style.title}>BOOK SWAP</Text>
            </View>
            <View style={style.boxMid}>
                <Text style={style.label}>Usuário</Text>
                <TextInput
                    style={style.input}
                    placeholder="Digite aqui seu usuário"
                    value={usuario}
                    onChangeText={setUsuario} 
                />
                <Text style={style.label}>Senha</Text>
                <TextInput
                    style={style.input}
                    placeholder="Digite aqui sua senha"
                    secureTextEntry={true}
                    value={senha}
                    onChangeText={setSenha} 
                />

                <Text style={style.linkText}>Esqueceu sua senha?</Text>

                <TouchableOpacity style={style.button} onPress={handleLogin}>
                    <Text style={style.buttonText}>Entrar</Text>
                </TouchableOpacity>
                
            </View>
            <View style={style.boxBottom}>
                <Text style={style.bottomText}>
                    Não tem uma conta?{' '}
                    <Text 
                        style={style.linkText} 
                        onPress={() => navigation.navigate('Registro')} 
                    >
                        Cadastre-se
                    </Text>
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}
