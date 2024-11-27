import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { theme } from '../core/theme'
import { Input } from 'native-base'

export default function TextInput({ errorText, description, ...props }) {
    return (
        <View style={styles.container}>
            <Input
                // style={styles.input}
                selectionColor={theme.colors.primary}
                underlineColor="transparent"
                mode="outlined"
                {...props}

            />
            {description && !errorText ? (
                <Text style={styles.description}>{description}</Text>
            ) : null}
            {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',

    },
    input: {
        backgroundColor: theme.colors.surface,
        height: 35,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#D1CFCF",
        borderRadius: 12
    },
    description: {
        fontSize: 13,
        color: theme.colors.secondary,
        paddingTop: 8,
    },
    error: {
        fontSize: 5,
        color: theme.colors.error,
        paddingTop: 8,
    },
})