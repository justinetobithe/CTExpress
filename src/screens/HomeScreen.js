
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import useAuthStore from '../store/authStore';
import Passenger from './Home/Passenger';
import Driver from './Home/Driver';

const HomeScreen = () => {
    const { userInfo } = useAuthStore();

    return (
        <View style={styles.container}>
            {userInfo?.role === 'driver' ? (
                <Driver />
            ) : (
                <Passenger />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default HomeScreen;
