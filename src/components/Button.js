import React from 'react';
import { Button as NativeBaseButton } from 'native-base';
import { StyleSheet } from 'react-native';

export default function Button({ variant, style, ...props }) {
    return (
        <NativeBaseButton
            variant={variant === 'outlined' ? 'outline' : 'solid'}
            style={[styles.button, style]}
            backgroundColor={variant === 'solid' ? '#080E2C' : 'transparent'}
            borderColor={variant === 'outlined' ? '#080E2C' : 'transparent'}
            _text={{
                ...styles.text,
                color: variant === 'outlined' ? '#080E2C' : '#fff',
            }}
            {...props}
        >
            {props.children}
        </NativeBaseButton>
    );
}

const styles = StyleSheet.create({
    button: {
        width: "100%",
        marginVertical: 10,
        paddingVertical: 2,
    },
    text: {
        fontWeight: 'normal',
        fontSize: 15,
        lineHeight: 26,
    },
});
