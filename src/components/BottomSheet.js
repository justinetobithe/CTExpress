import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity, RefreshControl } from 'react-native';
import { Select, Button } from 'native-base';
import useTerminalStore from '../store/terminalStore';
import { useNavigation } from '@react-navigation/native';
import Toast from './Toast';
import coordinatesData from '../coordinates.json';
import useAuthStore from '../store/authStore';
import useBookingStore from '../store/bookingStore';
import { getCurrentLocation } from '../helper/helperFunciton';
import StepIndicator from 'react-native-step-indicator';
import { laravelEcho } from '../core/LaravelPush';

const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#080E2C',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#080E2C',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#080E2C',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#080E2C',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#080E2C',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#080E2C'
}


const BottomSheet = ({ visible, toggleVisibility, setPolylineCoordinates, setCurrentBooking }) => {
    const { userInfo } = useAuthStore();
    const [refreshing, setRefreshing] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const [fromTerminal, setFromTerminal] = useState(null);
    const [toTerminal, setToTerminal] = useState(null);
    const navigation = useNavigation();
    const { showToast } = Toast();
    const { terminals, fetchTerminals } = useTerminalStore();
    const { currentBooking, dropOffPassenger, fetchCurrentBookingForUser, isLoading } = useBookingStore();
    const [previousFromTerminal, setPreviousFromTerminal] = useState(null);
    const [previousToTerminal, setPreviousToTerminal] = useState(null);
    const [previousBookingId, setPreviousBookingId] = useState(null);
    const eventSubscribed = useRef(false);
    const toastCooldown = useRef(false);
    const debounceToast = (message, type) => {
        if (!toastCooldown.current) {
            showToast(message, type);
            toastCooldown.current = true;
            setTimeout(() => {
                toastCooldown.current = false;
            }, 3000);
        }
    };

    const stepCount = 2;
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        laravelEcho('App.Events')
            .private('trip.status.updated')
            .listen('TripStatusUpdatedEvent', (response) => {
                console.log("RESPONSE: ", response)
                const { data } = response
                if (data.user_id == userInfo.id) {
                    if (userInfo.role === 'passenger') { 
                        getCurrentBookingUser();
                    }
                }
            })
    }, []);


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
        if (!currentBooking) {
            getCurrentBookingUser();
        }
    }, [userInfo.id]);

    useEffect(() => {
        fetchTerminals();
    }, [fetchTerminals]);

    useEffect(() => {
        const toValue = visible ? 1 : 0;
        Animated.timing(slideAnim, {
            toValue,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    const slideUp = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [240, 0],
    });

    const updateTripPolyline = () => {
        if (fromTerminal && toTerminal) {
            const selectedTrip = coordinatesData.features.find(feature =>
                feature.properties.from === fromTerminal.id &&
                feature.properties.to === toTerminal.id
            );

            if (selectedTrip) {
                setPolylineCoordinates(selectedTrip.geometry.coordinates);
                setCurrentBooking(null)
            }
        } else if (currentBooking) {
            const selectedTrip = coordinatesData.features.find(feature =>
                feature.properties.from === currentBooking.trip?.from_terminal_id &&
                feature.properties.to === currentBooking.trip?.to_terminal_id
            );

            if (selectedTrip) {
                setPolylineCoordinates(selectedTrip.geometry.coordinates);
                setCurrentBooking(currentBooking)
            }
        }
    };

    useEffect(() => {
        if (fromTerminal && toTerminal) {
            if (fromTerminal.id !== previousFromTerminal?.id || toTerminal.id !== previousToTerminal?.id) {
                updateTripPolyline();
                setPreviousFromTerminal(fromTerminal);
                setPreviousToTerminal(toTerminal);
            }
        } else if (currentBooking && currentBooking.id !== previousBookingId) {
            updateTripPolyline();
            setPreviousBookingId(currentBooking.id);
        }
    }, [fromTerminal, toTerminal, currentBooking, previousFromTerminal, previousToTerminal, previousBookingId]);

    const handleSelect = () => {
        if (!fromTerminal || !toTerminal) {
            showToast("Please select both From and To terminals", "error");
        } else {
            navigation.navigate('Booking', {
                fromTerminalId: fromTerminal.id,
                fromTerminalName: fromTerminal.name,
                toTerminalId: toTerminal.id,
                toTerminalName: toTerminal.name,
            });
        }
    };

    const handleClear = () => {
        setFromTerminal(null);
        setToTerminal(null);
        setPolylineCoordinates([]);
        currentBooking(null)
    };

    const handleDropOff = async () => {
        try {
            const location = await getCurrentLocation();
            const bookingId = currentBooking.id;

            const formData = {
                drop_at: [location.longitude, location.latitude],
            };

            console.log('Drop Off:', { formData });

            await dropOffPassenger(bookingId, formData, showToast);


            fetchCurrentBookingForUser(userInfo.id);
        } catch (error) {
            showToast(error, 'error');
        }
    };

    return (
        <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideUp }] }]}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getCurrentBookingUser} />}>
                <View style={styles.headerContainer}>
                    <Text style={styles.sheetTitle}>{currentBooking ? "Vehicle is now starting for your destination" : "Select Terminals"}</Text>
                    {(fromTerminal || toTerminal) && (
                        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                            <Text style={styles.clearButtonText}>Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {currentBooking ? (

                    <View style={styles.container}>

                        <View style={[styles.container, { marginTop: 20, marginBottom: 35 }]}>
                            <StepIndicator
                                customStyles={customStyles}
                                currentPosition={currentStep}
                                labels={[currentBooking.trip?.terminal_from?.name, currentBooking.trip?.terminal_to?.name]}
                                stepCount={stepCount}
                            />
                        </View>

                        <Button
                            onPress={handleDropOff}
                            variant="solid"
                            backgroundColor="#080E2C"
                            style={styles.bookButton}
                        >
                            Drop Off
                        </Button>
                    </View>
                ) : (
                    <>
                        <View>
                            <Text style={styles.label}>From:</Text>
                            <Select
                                selectedValue={fromTerminal?.id || ''}
                                placeholder="Select From Terminal"
                                onValueChange={(itemValue) => {
                                    const selectedTerminal = terminals.find(terminal => terminal.id === itemValue);
                                    setFromTerminal(selectedTerminal);

                                    if (selectedTerminal && toTerminal) {
                                        updateTripPolyline();
                                    }

                                    if (itemValue === toTerminal?.id) {
                                        setToTerminal(null);
                                    }
                                }}
                            >
                                {terminals.map((terminal) => (
                                    <Select.Item key={terminal.id} label={terminal.name} value={terminal.id} />
                                ))}
                            </Select>
                        </View>

                        <View style={styles.selectContainer}>
                            <Text style={styles.label}>To:</Text>
                            <Select
                                selectedValue={toTerminal?.id || ''}
                                placeholder="Select To Terminal"
                                onValueChange={(itemValue) => {
                                    const selectedTerminal = terminals.find(terminal => terminal.id === itemValue);
                                    setToTerminal(selectedTerminal);
                                }}
                                isDisabled={!fromTerminal}
                            >
                                {terminals
                                    .filter(terminal => terminal.id !== fromTerminal?.id)
                                    .map((terminal) => (
                                        <Select.Item key={terminal.id} label={terminal.name} value={terminal.id} />
                                    ))}
                            </Select>
                        </View>

                        <Button
                            onPress={handleSelect}
                            variant="solid"
                            backgroundColor="#080E2C"
                            style={styles.bookButton}
                        >
                            Select
                        </Button>
                    </>
                )}
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        elevation: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sheetTitle: {
        color: "#000",
        fontSize: 18,
        fontWeight: 'bold',
    },
    clearButton: {
        marginLeft: 10,
        backgroundColor: '#ffffff',
    },
    clearButtonText: {
        color: '#080E2C',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    bookButton: {
        marginTop: 20,
        height: 45
    },
    verticalLineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    verticalLine: {
        width: 2,
        height: 40,
        backgroundColor: '#080E2C',
        marginRight: 10,
    },
    terminalText: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 16,
        color: '#000',
    },
    notificationText: {
        color: 'green',
        fontSize: 16,
        marginTop: 10,
    }
});

export default BottomSheet;
