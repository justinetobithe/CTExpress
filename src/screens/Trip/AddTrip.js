import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from "react-native";
import { ScrollView, Center, Box, VStack, Button, FormControl, Input, Text, Select } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import useTripStore from '../../store/tripStore';
import useAuthStore from '../../store/authStore';
import Toast from '../../components/Toast';
import useTerminalStore from '../../store/terminalStore';
import useVehicleStore from '../../store/vehicleStore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { formatDate, formatDateLocale, generateTimeList } from '../../helper/helperFunciton';

export default function AddTrip({ navigation }) {
    const { userInfo } = useAuthStore();
    const { addTrip, isLoading } = useTripStore();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const { terminals, fetchTerminals } = useTerminalStore();
    const { vehicles, fetchVehiclesByDriver } = useVehicleStore();
    const [date, setDate] = useState(null);
    const { showToast } = Toast();
    const [time, setTime] = useState('');

    const timeList = generateTimeList();

    const { control, handleSubmit, reset, watch, setError, formState: { errors } } = useForm({
        defaultValues: {
            terminalFrom: '',
            terminalTo: '',
            vehicle: '',
            passengerCapacity: '20',
            tripDate: '',
            tripTime: '',
            fareAmount: '50',
            status: 'pending'
        },
        mode: 'onBlur'
    });

    const terminalFromValue = watch("terminalFrom");

    useEffect(() => {
        fetchTerminals();
    }, [fetchTerminals]);

    useEffect(() => {
        fetchVehiclesByDriver(userInfo.id);
    }, [fetchVehiclesByDriver]);

    const onSubmit = async (data) => {
        if (!date) {
            showToast("Date is required", "error");
            return;
        }
        if (!time) {
            showToast("Start time is required", "error");
            return;
        }

        const formData = {
            driver_id: userInfo.id,
            vehicle_id: data.vehicle,
            from_terminal_id: data.terminalFrom,
            to_terminal_id: data.terminalTo,
            passenger_capacity: data.passengerCapacity,
            trip_date: formatDate(date),
            start_time: time,
            fare_amount: data.fareAmount,
            status: 'pending',
        };

        try {
            await addTrip(formData);
            showToast("Trip added successfully!", "success");
            reset();
            setDate(null);
            navigation.goBack();
        } catch (error) {
            showToast("Failed to add trip. Please try again.", "error");
        }
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (selectedDate) => {
        setDate(selectedDate);
        hideDatePicker();
    };

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Center flex={1} px={4}>
                    <Box w="100%">
                        <VStack space={4}>
                            <FormControl isInvalid={errors.terminalFrom}>
                                <FormControl.Label>Terminal From</FormControl.Label>
                                <Controller
                                    control={control}
                                    name="terminalFrom"
                                    rules={{ required: "Terminal From is required" }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Select
                                            selectedValue={value}
                                            onValueChange={onChange}
                                            placeholder="Select Terminal"
                                            onBlur={onBlur}
                                        >
                                            {terminals.map((terminal) => (
                                                <Select.Item key={terminal.id} label={terminal.name} value={terminal.id} />
                                            ))}
                                        </Select>
                                    )}
                                />
                                {errors.terminalFrom && <Text color="red.500">{errors.terminalFrom.message}</Text>}
                            </FormControl>

                            <FormControl isInvalid={errors.terminalTo}>
                                <FormControl.Label>Terminal To</FormControl.Label>
                                <Controller
                                    control={control}
                                    name="terminalTo"
                                    rules={{ required: "Terminal To is required" }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Select
                                            selectedValue={value}
                                            onValueChange={onChange}
                                            placeholder="Select Terminal"
                                            onBlur={onBlur}
                                        >
                                            {terminals
                                                .filter((terminal) =>
                                                    terminal.id !== '1' && terminal.id !== terminalFromValue
                                                )
                                                .map((terminal) => (
                                                    <Select.Item key={terminal.id} label={terminal.name} value={terminal.id} />
                                                ))}
                                        </Select>
                                    )}
                                />
                                {errors.terminalTo && <Text color="red.500">{errors.terminalTo.message}</Text>}
                            </FormControl>

                            <FormControl isInvalid={errors.vehicle}>
                                <FormControl.Label>Vehicle</FormControl.Label>
                                <Controller
                                    control={control}
                                    name="vehicle"
                                    rules={{ required: "Vehicle is required" }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Select
                                            selectedValue={value}
                                            onValueChange={onChange}
                                            placeholder="Select Vehicle"
                                            onBlur={onBlur}
                                        >
                                            {vehicles.map((vehicle) => (
                                                <Select.Item
                                                    key={vehicle.id}
                                                    label={`${vehicle.brand} ${vehicle.model} (${vehicle.year}) - Plate No.: ${vehicle.license_plate}`}
                                                    value={vehicle.id}
                                                />
                                            ))}
                                        </Select>
                                    )}
                                />
                                {errors.vehicle && <Text color="red.500">{errors.vehicle.message}</Text>}
                            </FormControl>

                            <FormControl isInvalid={errors.passengerCapacity}>
                                <FormControl.Label>Passenger Capacity</FormControl.Label>
                                <Controller
                                    control={control}
                                    name="passengerCapacity"
                                    rules={{ required: "Passenger Capacity is required" }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            placeholder="Enter Passenger Capacity"
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            keyboardType="numeric"
                                        />
                                    )}
                                />
                                {errors.passengerCapacity && <Text color="red.500">{errors.passengerCapacity.message}</Text>}
                            </FormControl>

                            <FormControl isInvalid={errors.tripDate}>
                                <FormControl.Label>Date</FormControl.Label>
                                <Box alignItems="center" w="100%">
                                    <Input
                                        w="100%"
                                        value={date ? formatDateLocale(date) : ''}
                                        isReadOnly
                                        onChangeText={(text) => setDate(text)}
                                        InputRightElement={(
                                            <Button size="xs" rounded="none" backgroundColor="#080E2C" w="1/6" h="full" onPress={showDatePicker} title="Date" style={{ color: "#fff" }} />
                                        )}
                                    />
                                </Box>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                    minimumDate={new Date()}
                                />
                                {errors.tripDate && <Text color="red.500">{errors.tripDate.message}</Text>}
                            </FormControl>

                            <FormControl isInvalid={errors.tripTime}>
                                <FormControl.Label>Time</FormControl.Label>
                                <Controller
                                    control={control}
                                    name="tripTime"
                                    rules={{
                                        required: "Trip Time is required",
                                        pattern: {
                                            value: /^(?:[01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                                            message: "Time must be in HH:MM format (24-hour)"
                                        }
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Select
                                            selectedValue={value}
                                            onValueChange={(selectedValue) => {
                                                onChange(selectedValue);
                                                setTime(selectedValue);
                                            }}
                                            placeholder="Select Time"
                                            onBlur={onBlur}
                                        >
                                            {timeList.map((time) => (
                                                <Select.Item key={time.value} label={time.label} value={time.value} />
                                            ))}
                                        </Select>
                                    )}
                                />
                                {errors.tripTime && <Text color="red.500">{errors.tripTime.message}</Text>}
                            </FormControl>


                            <FormControl isInvalid={errors.fareAmount}>
                                <FormControl.Label>Fare Amount</FormControl.Label>
                                <Controller
                                    control={control}
                                    name="fareAmount"
                                    rules={{ required: "Fare Amount is required" }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            placeholder="Enter Fare Amount"
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            keyboardType="numeric"
                                        />
                                    )}
                                />
                                {errors.fareAmount && <Text color="red.500">{errors.fareAmount.message}</Text>}
                            </FormControl>

                            <Button
                                isLoading={isLoading}
                                onPress={handleSubmit(onSubmit)}
                                mt={4}
                                backgroundColor="#080E2C"
                            >
                                Add Trip
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
        backgroundColor: '#fff'
    }
});
