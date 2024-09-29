import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#BFBFBF', 
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 20,
        justifyContent: 'space-between',
        marginTop: 28
    },
    bookCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        margin: 5,
        width: '47.6%',
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    bookTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },
    bookImage: {
        width: '100%',
        height: 150,  
        resizeMode: 'contain', 
    },    
    noImageText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#888',
        marginTop: 10,
    },
    emptyText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#fff',
    },

    // Estilos para a barra de navegação
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 80,  
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 10,
        width: '110%',
        position: 'absolute',  
        bottom: 0,  
    },
    navItem: {
        alignItems: 'center',
    },
    navItemCentral: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#375E87',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -35,
        elevation: 5,
    },
    navText: {
        fontSize: 12,
        color: '#000',
    },
    loadingIndicator: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        alignItems: 'center',
    }   
});