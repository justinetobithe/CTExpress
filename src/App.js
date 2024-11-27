import React from 'react';
import { NativeBaseProvider } from 'native-base';
import Navigation from './components/Navigation';
import { AuthProvider } from './context/AuthContext';
import Mapbox from '@rnmapbox/maps';

Mapbox.setAccessToken('sk.eyJ1IjoianVzdGluZXRvYml0aGUiLCJhIjoiY20zeXQ4NGhmMXBpdzJsc2NmdzM5b2h3ayJ9.Qwk8VK_o0gLtVrXcpOl9aw');

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
