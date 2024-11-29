import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, LogBox } from 'react-native';
import useTripStore from '../../store/tripStore';
import { Swipeable } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import usePassengerStore from '../../store/passengerStore';
import Toast from '../../components/Toast';
import { capitalizeWords, formatDateLocale } from '../../helper/helperFunciton';

const TripDetails = ({ navigation, route }) => {
    const { showToast } = Toast();
    const [refreshing, setRefreshing] = useState(false);
    const { tripId } = route.params;
    const { updateTripStatus, currentTrip, showTrip } = useTripStore();

    const { cancelPassenger, confirmPassenger, isLoading } = usePassengerStore();

    const fetchTripDetails = async () => {
        setRefreshing(true);
        try {
            await showTrip(tripId);
        } catch (error) {
            console.error("Error fetching trip:", error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTripDetails();
    }, [tripId, showTrip]);

    const renderPassengerItem = ({ item }) => {
        const isSwipeable = item.status !== 'confirmed' && item.status !== 'canceled';

        const renderRightActions = () => (
            <TouchableOpacity style={styles.actionButton} onPress={() => handleCancel(item)}>
                <MaterialCommunityIcons name="account-cancel-outline" size={44} color="red" />
            </TouchableOpacity>
        );

        const renderLeftActions = () => (
            <TouchableOpacity style={styles.actionButton} onPress={() => handleConfirm(item)}>
                <MaterialCommunityIcons name="account-check-outline" size={44} color="green" />
            </TouchableOpacity>
        );

        return (
            isSwipeable ? (
                <Swipeable
                    renderLeftActions={renderLeftActions}
                    renderRightActions={renderRightActions}
                >
                    <View style={styles.passengerItem}>
                        <Text style={styles.passengerText}>Passenger Name: {item.booking?.user?.name}</Text>
                        <Text style={styles.passengerText}>Booking ID: {item.booking_id}</Text>
                        <Text style={styles.passengerText}>
                            Status: <Text style={{ color: getStatusColor(item.status) }}>{capitalizeWords(item.status || 'Not confirmed')}</Text>
                        </Text>
                    </View>
                </Swipeable>
            ) : (
                <View style={styles.passengerItem}>
                    <Text style={styles.passengerText}>Passenger Name: {item.booking?.user?.name}</Text>
                    <Text style={styles.passengerText}>Booking ID: {item.booking_id}</Text>
                    <Text style={styles.passengerText}>
                        Status: <Text style={{ color: getStatusColor(item.status) }}>{capitalizeWords(item.status || 'Not confirmed')}</Text>
                    </Text>
                </View>
            )
        );
    };


    const passengerCount = currentTrip?.passengers.filter(p => p.status !== 'canceled').length || 0;

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'blue';
            case 'canceled':
                return 'red';
            case 'not_attended':
                return 'gray';
            default:
                return 'orange';
        }
    };

    const handleStartButtonPress = async () => {
        console.log("Start button pressed");
        try {
            await updateTripStatus(tripId, 'started', showToast);
            fetchTripDetails();
        } catch (error) {
            console.error("Error starting trip:", error);
        }
    };

    const handleConfirm = async (item) => {
        console.log("Confirming:", item);
        try {
            await confirmPassenger(item.id, showToast);
            fetchTripDetails();
        } catch (error) {
            console.error("Error confirming passenger:", error);
        }
    };

    const handleCancel = async (item) => {
        console.log("Canceling:", item);
        try {
            await cancelPassenger(item.id, showToast);
            fetchTripDetails();
        } catch (error) {
            console.error("Error canceling passenger:", error);
        }
    };

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchTripDetails} />}
            >
                <View style={{ flex: 1, }}>
                    <Text style={styles.title}>Trip Details</Text>
                    {currentTrip ? (
                        <>
                            <Text style={styles.tripTitle}>{`Trip Date: ${formatDateLocale(currentTrip.trip_date)}`}</Text>
                            <Text style={styles.tripTitle}>Vehicle: {currentTrip.vehicle?.brand} {currentTrip.vehicle?.model}</Text>
                            <Text style={styles.tripTitle}>From: {currentTrip.terminal_from?.name}</Text>
                            <Text style={styles.tripTitle}>To: {currentTrip.terminal_to?.name}</Text>

                            <Text style={styles.infoText}>
                                Start Time: {currentTrip.start_time} | Passengers: {passengerCount}/{currentTrip.passenger_capacity}
                            </Text>

                            <Text style={styles.passengerTitle}>Passengers</Text>

                            <View style={{ paddingBottom: 70 }}>
                                <FlatList
                                    data={currentTrip.passengers}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={renderPassengerItem}
                                    ListEmptyComponent={
                                        <View style={styles.emptyContainer}>
                                            <Text style={styles.emptyText}>No passengers available</Text>
                                        </View>
                                    }
                                />
                            </View>
                        </>
                    ) : (
                        <Text>No trip details found.</Text>
                    )}
                </View>
            </ScrollView >

            <TouchableOpacity style={styles.startButton} onPress={handleStartButtonPress}>
                <Text style={styles.startButtonText}>
                    {currentTrip?.status === 'in_progress' ? 'On our way to destination' : 'Start'}
                </Text>
            </TouchableOpacity>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,

    },
    tripItem: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    tripTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    infoText: {
        fontSize: 16,
        marginTop: 10,
        color: 'black',
    },
    passengerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        color: "#000"
    },
    passengerItem: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    passengerText: {
        marginBottom: 5,
        fontSize: 16,
        color: 'black',
    },
    actionButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        marginTop: 8,
        height: 110,
        // elevation: 3,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.2,
        // shadowRadius: 2,
    },
    emptyText: {
        fontSize: 16,
        color: 'gray',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    startButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#080E2C',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TripDetails;
