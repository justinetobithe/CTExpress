import React from 'react'
import { View, StyleSheet } from "react-native"

export default function Layout({ children }) {
    return (
        <View style={styles.container}>
            <View style={styles.layout}>
                {children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        width: "100%",
        maxWidth: 340,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    layout: {
        flex: 1, width: "100%"
    }
})
