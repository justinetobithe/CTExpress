import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import useTripStore from '../../store/tripStore';
import useAuthStore from '../../store/authStore';
import { formatDateLocale, formatTime, getCurrentDateInTimeZone } from '../../helper/helperFunciton';
import { useNavigation } from '@react-navigation/native';
import Toast from '../../components/Toast';

const Driver = () => {
    const { showToast } = Toast();
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const { userInfo } = useAuthStore();
    const { trips, fetchDriverTrips, updateDriverDecision } = useTripStore();

    const getTrips = async () => {
        setRefreshing(true);
        try {
            const today = getCurrentDateInTimeZone('Asia/Manila');
            console.log("today", today);
            await fetchDriverTrips(userInfo.id, today);
        } catch (error) {
            console.error("Error fetching trips:", error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        getTrips();
    }, [userInfo.id]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'orange';
            case 'completed':
                return 'green';
            case 'canceled':
                return 'red';
            case 'in_progress':
                return 'blue';
            case 'failed':
                return 'gray';
            default:
                return 'black';
        }
    };

    const formatStatus = (status) => {
        if (status === 'in_progress') {
            return 'In Progress';
        }
        return status.replace('_', ' ').toUpperCase();
    };

    const handleApproveTrip = async (id) => {
        try {
            getTrips();
            await updateDriverDecision(id, userInfo.id, 'approved', showToast);
        } catch (error) {
            console.error("Error approving trip:", error);
        }
    };

    const handleRejectTrip = async (id) => {
        try {
            await updateDriverDecision(id, userInfo.id, 'rejected', showToast);
            getTrips();
        } catch (error) {
            console.error("Error rejecting trip:", error);
        }
    };


    const renderTripItem = ({ item }) => (
        <TouchableOpacity
            style={styles.tripItem}
            onPress={() => item.is_driver_accepted === 1 && handleTripPress(item)}
            disabled={item.is_driver_accepted === 0}
        >
            <Text style={styles.tripTitle}>{`Booking Date: ${formatDateLocale(item.trip_date)}`}</Text>
            <Text style={styles.tripText}>{`From Terminal: ${item.terminal_from?.name}`}</Text>
            <Text style={styles.tripText}>{`To Terminal: ${item.terminal_to?.name}`}</Text>
            <Text style={styles.tripText}>{`Start Time: ${formatTime(item.start_time)}`}</Text>
            <Text style={styles.tripText}>{`Passenger Capacity: ${item.passenger_capacity}`}</Text>
            <Text style={styles.tripText}>{`Fare Amount: ₱${item.fare_amount}`}</Text>
            <Text style={styles.tripText}>
                <Text style={{ color: 'black', fontWeight: 'bold', textTransform: 'capitalize' }}>{`Status: `}</Text>
                <Text style={{ color: getStatusColor(item.status), fontWeight: 'bold', textTransform: 'capitalize' }}>
                    {formatStatus(item.status)}
                </Text>
            </Text>

            {item.is_driver_accepted === 0 && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.approveButton}
                        onPress={() => handleApproveTrip(item.id)}
                    >
                        <Text style={styles.approveButtonText}>Approve</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => handleRejectTrip(item.id)}
                    >
                        <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );

    const handleTripPress = (trip) => {
        navigation.navigate('TripDetails', {
            tripId: trip.id,
        });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={trips}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTripItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getTrips} />}
                ListEmptyComponent={<Text style={styles.emptyText}>No active trips available</Text>}
                contentContainerStyle={{ padding: 10 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
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
    tripText: {
        color: 'black',
        marginBottom: 10,
    },
    emptyText: {
        color: 'black',
        textAlign: 'center',
        marginTop: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    approveButton: {
        backgroundColor: '#080E2C',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
    },
    rejectButton: {
        backgroundColor: '#D32F2F',
        padding: 10,
        borderRadius: 5,
        flex: 1,
    },
    approveButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    rejectButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default Driver; 
