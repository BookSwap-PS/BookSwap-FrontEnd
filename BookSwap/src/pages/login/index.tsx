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
import { useNavigation } from '@react-navigation/native'; // Importe o hook de navegação
import { style } from "./styles";
import Logo from "../../assets/Logo.png";

export default function Login() {
    const navigation = useNavigation(); // Hook para navegação

    // Estados para armazenar os valores de usuário e senha
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");

    // Função para lidar com o login
    const handleLogin = async () => {
        // Verificação básica antes de enviar para a API
        if (!usuario || !senha) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        try {
            // Fazer a requisição POST para a API Django
            const response = await fetch('http://10.10.31.132:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: usuario, // Enviar o nome de usuário
                    password: senha,   // Enviar a senha
                }),
            });

            const data = await response.json();
            
            // Verificar se o login foi bem-sucedido
            if (response.ok) {
                Alert.alert("Sucesso", "Login realizado com sucesso!");
                navigation.navigate('Livro'); // Redirecionar para a página Home
            } else {
                Alert.alert("Erro", data.message || "Login falhou, verifique suas credenciais.");
            }
        } catch (error) {
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
                    value={usuario} // Valor do estado "usuario"
                    onChangeText={setUsuario} // Atualizar o estado quando o texto mudar
                />
                <Text style={style.label}>Senha</Text>
                <TextInput
                    style={style.input}
                    placeholder="Digite aqui sua senha"
                    secureTextEntry={true}
                    value={senha} // Valor do estado "senha"
                    onChangeText={setSenha} // Atualizar o estado quando o texto mudar
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
                        onPress={() => navigation.navigate('Registro')} // Navega para a página de cadastro
                    >
                        Cadastre-se
                    </Text>
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}
