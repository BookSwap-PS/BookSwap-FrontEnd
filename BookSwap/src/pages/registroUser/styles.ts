import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A2B45',
        paddingTop: 50,  // Adiciona espaçamento no topo
    },
    scrollContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30, // Ajuste o espaçamento do logo
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
        marginBottom: 20, // Aumentar o espaçamento entre os inputs
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#0066FF',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30, // Aumentar o espaçamento abaixo do botão
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
        marginBottom: 30, // Aumentar o espaçamento dos botões sociais
    },
    socialButton: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 50,
    },
    loginText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 20, // Adicionar espaçamento antes do texto de login
    },
    loginLink: {
        color: '#FF6347',
        fontWeight: 'bold',
    },
});

export default styles;
