import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

function MessageDetailScreen({ route, navigation }) {
    const { page, pageParameter, message, title, body } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: title || 'Mesaj Detayı' });
    }, [title]);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.body}>{body}</Text>
            </View>
            {/* <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Mesaj ID: {pageParameter}</Text>
                {message && <Text style={styles.infoText}>Ek Mesaj: {message}</Text>}
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    card: {
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    body: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
    },
    infoContainer: {
        marginTop: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#333',
    },
});

export default MessageDetailScreen;
