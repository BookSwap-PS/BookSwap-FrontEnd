import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between', // Distribui o espaço igualmente
        width: '100%',
        backgroundColor: '#1A1A2E'
    },
    boxTop: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingTop: 100,
        backgroundColor: '#1A1A2E'
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain'
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10
    },
    boxMid: {
        flex: 2,
        alignItems: 'flex-end',
        justifyContent: 'center', // Centraliza os inputs e o botão de login
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: 50 // Aumenta o espaço abaixo dos elementos
    },
    label: {
        alignSelf: 'flex-start',
        color: 'white',
        fontSize: 16,
        marginBottom: 5
    },
    input: {
        width: '100%',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
        fontSize: 16,
        marginBottom: 20
    },
    button: {
        backgroundColor: '#3C5A99',
        width: '100%',
        padding: 10,
        alignItems: 'center',
        borderRadius: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    linkText: {
        color: '#A8DADC',
        marginTop: 20,
        paddingBottom: 20

    },
    boxBottom: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#1A1A2E'
    },
    bottomText: {
        color: 'white',
        fontSize: 16
    }
});
