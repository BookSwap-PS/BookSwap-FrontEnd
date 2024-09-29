import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A2B45',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    listContent: {
        paddingTop: 20,
        paddingBottom: 80,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    bookCard: {
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        padding: 10,
        width: '48%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    bookImage: {
        width: '100%',
        height: 120,
        resizeMode: 'contain',
        marginTop: 10,
    },
    noImageText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#888',
        textAlign: 'center',
        marginTop: 10,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
        justifyContent: 'center',
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    errorContainer: {
        padding: 20,
        backgroundColor: 'red',
        marginBottom: 10,
    },
    errorText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    loadingIndicator: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
});