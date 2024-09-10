import React from "react";
import {
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';

import { style } from "./styles";
import Logo from "../../assets/Logo.png";

export default function Login() {
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
                <Text style={style.label}>E-mail</Text>
                <TextInput
                    style={style.input}
                    placeholder="Digite aqui seu e-mail"
                    keyboardType="email-address"
                />
                <Text style={style.label}>Senha</Text>
                <TextInput
                    style={style.input}
                    placeholder="Digite aqui sua senha"
                    secureTextEntry={true}
                />

                <Text style={style.linkText}>Esqueceu sua senha?</Text>

                <TouchableOpacity style={style.button}>
                    <Text style={style.buttonText}>Entrar</Text>
                </TouchableOpacity>
                
            </View>
            <View style={style.boxBottom}>
                <Text style={style.bottomText}>Não tem uma conta? Cadastre-se</Text>
            </View>
        </KeyboardAvoidingView>
    );
}
