
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import useAuthStore from '../store/authStore';
import Passenger from './Home/Passenger';
import Driver from './Home/Driver';
import useBookingStore from '../store/bookingStore';

const HomeScreen = () => {
    const { userInfo } = useAuthStore();
    const { currentBooking, fetchCurrentBookingForUser, isLoading } = useBookingStore();

    const getCurrentBookingUser = async () => {
        setRefreshing(true);
        try {
            updateTripPolyline();
            await fetchCurrentBookingForUser(userInfo.id);
        } catch (error) {
            console.error("Error fetching current booking:", error);
            setPolylineCoordinates([]);
            setCurrentBooking(null)
            handleClear();
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (userInfo?.role === 'passenger') {
            if (!currentBooking) {
                getCurrentBookingUser();
            }
        }
    }, [userInfo.id]);

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
