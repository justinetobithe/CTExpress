// import React from 'react'
// import { View, Text } from "react-native"
// import { WebView } from 'react-native-webview';

// export default function GCashScreen() {
//     return (
//         <WebView source={{ uri: 'https://reactnative.dev/' }} style={{ flex: 1 }} />
//     )
// }


import React, { useState } from 'react';
import { View, Text, Alert } from "react-native";
import { WebView } from 'react-native-webview';

export default function GCashScreen() {
    const [phoneNumber, setPhoneNumber] = useState(null);

    const onMessage = (event) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.success && data.phoneNumber) {
            setPhoneNumber(data.phoneNumber);
            Alert.alert("GCash linked successfully", `Phone Number: ${data.phoneNumber}`);
        } else {
            Alert.alert("GCash linking failed", "There was an issue linking your account.");
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {phoneNumber && <Text>Linked Phone Number: {phoneNumber}</Text>}
            <WebView
                source={{ uri: 'https://api.sandbox.hit-pay.com/v1/payment-requests' }}
                style={{ flex: 1 }}
                onMessage={onMessage}
            />
        </View>
    );
}
