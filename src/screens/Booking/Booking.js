import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, LogBox, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { Button, Center, Box, VStack, FormControl, Input, SectionList, Heading, HStack, Text } from 'native-base';
import useTripStore from '../../store/tripStore';
import { formatTime, getCurrentDateInTimeZone } from '../../helper/helperFunciton';
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from '../../components/Toast';
import { useForm, Controller } from 'react-hook-form';
import useAuthStore from '../../store/authStore';
import useBookingStore from '../../store/bookingStore';

export default function Booking({ route, navigation }) {
    const { showToast } = Toast();
    const { userInfo } = useAuthStore();
    const [refreshing, setRefreshing] = useState(false);
    const { fromTerminalId, fromTerminalName, toTerminalId, toTerminalName } = route.params;
    const { fetchFutureTrips, trips } = useTripStore();

    const { addBooking, isLoading } = useBookingStore();
    const [selectedTripId, setSelectedTripId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            user_id: '',
            trip_id: '',
            booked_at: '',
            status: 'pending',

        }
    });

    console.log("userInfo", userInfo)

    const getTrips = async () => {
        setRefreshing(true);
        try {
            await fetchFutureTrips(fromTerminalId, toTerminalId);
        } catch (error) {
            console.error("Error fetching trips:", error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        getTrips();
    }, [fetchFutureTrips, fromTerminalId, toTerminalId]);

    const sectionedTrips = trips?.map(trip => ({
        title: `${formatTime(trip.start_time)} - Capacity: ${trip.passenger_capacity} - Price: ₱${trip.fare_amount}`,
        data: [trip],
    })) || [];

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    }, []);

    const handleTripSelection = (tripId) => {
        setSelectedTripId(tripId);
        console.log("tripId", tripId);
    };

    const handlePaymentMethod = (method) => {
        setPaymentMethod(method);
    };

    const onSubmit = async (data) => {
        if (!selectedTripId) {
            showToast("Please select a trip", "error");
            return;
        }
        if (!paymentMethod) {
            showToast("Please select a payment method", "error");
            return;
        }

        const selectedTrip = trips.find(trip => trip.id === selectedTripId);
        const fareAmount = selectedTrip?.fare_amount;

        if (!fareAmount) {
            showToast("Fare amount is missing", "error");
            return;
        }

        const totalPayment = parseFloat(calculateTotalPayment(fareAmount));

        const today = getCurrentDateInTimeZone();

        const formData = {
            user_id: userInfo.id,
            trip_id: selectedTripId,
            booked_at: today,
            status: 'pending',
            paid: false,
            payment_method: paymentMethod,
            total_amount: totalPayment,
        };


        if (paymentMethod === 'cash') {
            await addBooking(formData, showToast, navigation);
        } else {
            const paymentScreen = paymentMethod === 'paymaya' ? 'PaymayaScreen' : 'GCashScreen';
            navigation.navigate(paymentScreen, {
                paymentMethod,
                formData,
                totalPayment,
                fromTerminalName,
                toTerminalName,
            });
        }
    };

    const calculateTotalPayment = (fareAmount) => {
        if (!userInfo.classification) {
            return fareAmount.toFixed(2);
        }

        const isDiscountEligible = ['student', 'PWD', 'senior citizen'].includes(userInfo.classification);
        const discountRate = isDiscountEligible ? 0.20 : 0;
        const discountedAmount = fareAmount - (fareAmount * discountRate);
        return discountedAmount.toFixed(2);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getTrips} />}>
                <Center flex={1} px={4}>
                    <Box w="100%">
                        <VStack space={4}>
                            <FormControl>
                                <FormControl.Label>From</FormControl.Label>
                                <Input value={fromTerminalName} isReadOnly />
                            </FormControl>
                            <FormControl>
                                <FormControl.Label>To</FormControl.Label>
                                <Input value={toTerminalName} isReadOnly />
                            </FormControl>

                            <Heading fontSize="lg" mt="4" pb="0">Available Trips Today</Heading>
                            {sectionedTrips.length === 0 ? (
                                <Text style={{ textAlign: 'center', marginTop: 20 }}>No trips found</Text>
                            ) : (
                                <SectionList
                                    sections={sectionedTrips}
                                    keyExtractor={(item, index) => item.id || index.toString()}
                                    renderItem={({ item }) => (
                                        <View
                                            style={[styles.tripItem, selectedTripId === item.id && styles.selectedTripItem]}
                                            onTouchEnd={() => handleTripSelection(item.id)}
                                        >
                                            <Text style={{ paddingBottom: 10, marginBottom: 10, fontWeight: "bold" }}>{`${item.driver?.first_name} ${item.driver?.last_name} - ${item.driver?.vehicle?.brand} ${item.driver?.vehicle?.model} (${item.driver?.vehicle?.year}) - Plate No.: ${item.driver?.vehicle?.license_plate}`}</Text>
                                        </View>
                                    )}
                                    renderSectionHeader={({ section }) => (
                                        <HStack justifyContent="space-between" alignItems="center" mt="2" pb="2">
                                            <Heading
                                                fontSize="md"
                                                onTouchEnd={() => handleTripSelection(section.data[0].id)}
                                            >
                                                {section.title}
                                            </Heading>
                                            {selectedTripId === section.data[0].id && (
                                                <Ionicons name="checkmark-sharp" size={22} color="#000" />
                                            )}
                                        </HStack>
                                    )}
                                />
                            )}

                            <VStack space={2} mt="4">
                                {selectedTripId && (
                                    <View style={{ marginBottom: 20 }}>
                                        <Text fontSize="lg" fontWeight="bold">
                                            Trip Fare: ₱{trips.find(trip => trip.id === selectedTripId)?.fare_amount}
                                        </Text>
                                        <Text fontSize="lg" color={userInfo.classification ? 'green.600' : 'black'} fontWeight="bold">
                                            Total Payment: ₱{calculateTotalPayment(trips.find(trip => trip.id === selectedTripId)?.fare_amount)}
                                        </Text>
                                        {userInfo.classification ? (
                                            <Text color="green.600">
                                                A 20% discount has been applied for {userInfo.classification}.
                                            </Text>
                                        ) : (
                                            <Text>No discount available.</Text>
                                        )}

                                    </View>
                                )}

                                <Heading fontSize="lg" mt="2" pb="4">Select Payment Method</Heading>

                                <TouchableOpacity
                                    style={[
                                        styles.paymentButton,
                                        paymentMethod === 'cash' ? styles.activeButton : null,
                                    ]}
                                    onPress={() => handlePaymentMethod('cash')}
                                >
                                    <Text style={styles.paymentText}>Cash</Text>
                                </TouchableOpacity>

                                <View style={styles.divider}>
                                    <View style={styles.line} />
                                    <Text style={styles.orText}>or</Text>
                                    <View style={styles.line} />
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.paymentButton,
                                        paymentMethod === 'gcash' ? styles.activeButton : null,
                                    ]}
                                    onPress={() => handlePaymentMethod('gcash')}
                                >
                                    <Image source={require('../../assets/img/gcash.png')} style={styles.paymentImage} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.paymentButton,
                                        paymentMethod === 'paymaya' ? styles.activeButton : null,
                                    ]}
                                    onPress={() => handlePaymentMethod('paymaya')}
                                >
                                    <Image source={require('../../assets/img/paymaya.png')} style={styles.paymentImage} />
                                </TouchableOpacity>

                            </VStack>

                            <Button
                                isLoading={isLoading}
                                onPress={handleSubmit(onSubmit)}
                                variant="solid"
                                backgroundColor="#080E2C"
                                style={styles.confirmButton}
                            >
                                Confirm Booking
                            </Button>

                        </VStack>
                    </Box>
                </Center>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    tripItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    // selectedTripItem: {
    //     backgroundColor: '#e0f7fa',
    // },
    confirmButton: {
        marginTop: 20,
        height: 50,
        marginBottom: 20,
    },
    paymentButton: {
        width: '100%',
        alignItems: 'center',
        padding: 10,
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 5,
        justifyContent: 'center',
    },
    activeButton: {
        borderColor: 'blue',
    },
    paymentImage: {
        width: 200,
        height: 25,
        resizeMode: 'contain',
    },
    paymentText: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 1,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
});
