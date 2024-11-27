import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Heading } from 'native-base';

export default function PaymentScreen() {
    const [selectedPayment, setSelectedPayment] = useState('cash');
    const navigation = useNavigation();

    const handlePaymentSelection = (method) => {
        setSelectedPayment(method);
    };

    const handleGcashPress = () => {
        navigation.navigate('GCashScreen');
    };

    const handlePaymayaPress = () => {
        navigation.navigate('PaymayaScreen');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.card,
                    selectedPayment === 'cash' ? styles.selectedCard : null,
                ]}
                onPress={() => handlePaymentSelection('cash')}
            >
                <Text style={styles.cardTitle}>Cash</Text>
                {selectedPayment === 'cash' && <Text style={styles.defaultText}>Default</Text>}
            </TouchableOpacity>

            <Heading fontSize="lg" mt="4" pb="4">E-Wallets</Heading>

            <TouchableOpacity style={styles.dashCard} onPress={handleGcashPress}>
                <Text style={styles.linkText}>+ Link</Text>
                <Image source={require('../../../src/assets/img/gcash.png')} style={styles.walletImage} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.dashCard} onPress={handlePaymayaPress}>
                <Text style={styles.linkText}>+ Link</Text>
                <Image source={require('../../../src/assets/img/paymaya.png')} style={styles.walletImage} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    card: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: '#007BFF',
    },
    cardTitle: {
        color: "#000",
        fontSize: 18,
        fontWeight: 'bold',
    },
    defaultText: {
        fontSize: 14,
        color: '#007BFF',
        marginTop: 5,
    },
    dashCard: {
        padding: 5,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    walletImage: {
        width: 200,
        height: 50,
        resizeMode: 'contain',
    },
    linkText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007BFF',
    },
});
