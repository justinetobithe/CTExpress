import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from "react-native";
import { WebView } from 'react-native-webview';
import usePaymentStore from '../../store/paymentStore';
import useBookingStore from '../../store/bookingStore';
import { laravelEcho } from '../../core/LaravelPush';

export default function PaymayaScreen({ route, navigation }) {
    const { paymentMethod, formData, totalPayment, fromTerminalName, toTerminalName } = route.params;
    const { checkout, isLoading, checkoutUrl, paymentIntentId, resetCheckoutUrl } = usePaymentStore();
    const { addBooking } = useBookingStore();
    const [webViewHasLoadedContent, setWebViewHasLoadedContent] = useState(false);

    console.log(paymentMethod)

    useEffect(() => {
        return () => {
            resetCheckoutUrl()
        }
    }, [])

    useEffect(() => {
        laravelEcho('App.Events')
            .private('paymongo.paid')
            .listen('PaymongoPaidEvent', (response) => {
                console.log("paymentIntentId: ", paymentIntentId)
                console.log("RESPONSE: ", response)
                const { data } = response
                if (data.payment_intent_id == paymentIntentId) {
                    navigation.navigate('HomeScreen');
                    console.log("formData", formData)
                    addBooking(formData);
                }
            })
    }, [paymentIntentId]);

    useEffect(() => {
        const initiatePayment = async () => {
            try {
                const description = `${fromTerminalName} - ${toTerminalName}`;
                const checkoutData = {
                    payment_method: paymentMethod,
                    description,
                    amount: totalPayment,
                };

                const url = await checkout(checkoutData, (msg, type) => {
                    if (type === "error") Alert.alert("Error", msg);
                });

                if (!url) {
                    throw new Error("Failed to retrieve checkout URL.");
                }
            } catch (error) {
                console.error("Payment initiation error:", error);
                Alert.alert("Error", "Failed to initiate payment. Please try again.");
            }
        };

        if (!checkoutUrl) {
            initiatePayment();
        }
    }, [checkout, paymentMethod, totalPayment, fromTerminalName, toTerminalName, checkoutUrl]);

    if (isLoading || !checkoutUrl) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const onMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.success) {
                Alert.alert('Payment Success', 'Your payment was processed successfully.');
            } else {
                Alert.alert('Payment Failed', 'There was an issue processing your payment.');
            }
        } catch (error) {
            console.error('WebView message error:', error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <WebView
                source={{ uri: checkoutUrl }}
                style={{ flex: 1 }}
                onMessage={onMessage}
            />
        </View>
    );
}
