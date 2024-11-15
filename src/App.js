import React from 'react';
import { NativeBaseProvider } from 'native-base';
import Navigation from './components/Navigation';
import { AuthProvider } from './context/AuthContext';

const originalWarn = console.warn;
console.warn = (message, ...args) => {
    if (message.includes('SSRProvider is not necessary and is a noop')) {
        return;
    }
    originalWarn(message, ...args);
};

export default function App() {
    return (
        <AuthProvider>
            <NativeBaseProvider>
                <Navigation />
            </NativeBaseProvider>
        </AuthProvider>
    );
}
