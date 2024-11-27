import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { VStack, Input, Button, Text, FormControl, Center, Box, Select } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import useAuthStore from '../store/authStore';
import Toast from '../components/Toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dateFormat from "dateformat";
import EvilIcons from 'react-native-vector-icons/EvilIcons';

export default function RegisterScreen({ navigation }) {
    const { register, isLoading } = useAuthStore();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const minDate = new Date(1960, 0, 1);
    const [selectedDob, setSelectedDob] = useState(minDate)
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            address: '',
            phone_number: '',
            dob: '',
            classification: '',
            password: '',
            confirmPassword: ''
        }
    });

    const { showToast } = Toast();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            showToast("Passwords do not match", "error");
            return;
        }

        if (!selectedDob) {
            showToast("Date of birth is required", "error");
            return;
        }

        try {
            const res = await register({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                address: data.address,
                dob: selectedDob ? dateFormat(selectedDob, "yyyy-mm-dd") : "",
                classification: data.classification,
                phone_number: data.phone_number,
                password: data.password,
                role: 'passenger',
            });

            if (res.success) {
                showToast(res.message, "success");
                navigation.navigate('Login');
                reset();
            } else {
                showToast(res.message, "error");
            }
        } catch (e) {
            showToast("Registration failed", "error");
        }
    };


    const classificationOptions = [
        { value: "student", label: "Student" },
        { value: "pwd", label: "PWD" },
        { value: "senior cetizen", label: "Senior Cetizen" },
    ]

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setSelectedDob(date)
        console.log(dateFormat(selectedDob, "yyyy-mm-dd"))
        hideDatePicker();
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

            <Center>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/img/logo.png')}
                        style={styles.logo}
                    />
                </View>
            </Center>
            <Center flex={1} px={4}>
                <Box w="100%" maxW="300px">
                    <VStack space={4}>
                        <FormControl isInvalid={errors.name}>
                            <FormControl.Label>First Name</FormControl.Label>
                            <Controller
                                control={control}
                                name="first_name"
                                rules={{ required: 'First name is required' }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        placeholder="Enter your first name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="words"
                                    />
                                )}
                            />
                            {errors.first_name && <Text color="red.500">{errors.first_name.message}</Text>}
                        </FormControl>

                        <FormControl isInvalid={errors.name}>
                            <FormControl.Label>Last Name</FormControl.Label>
                            <Controller
                                control={control}
                                name="last_name"
                                rules={{ required: 'Last name is required' }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        placeholder="Enter your last name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="words"
                                    />
                                )}
                            />
                            {errors.last_name && <Text color="red.500">{errors.last_name.message}</Text>}
                        </FormControl>

                        <FormControl isInvalid={errors.email}>
                            <FormControl.Label>Email</FormControl.Label>
                            <Controller
                                control={control}
                                name="email"
                                rules={{
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Invalid email format'
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        placeholder="Enter your email"
                                        keyboardType="email-address"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="none"
                                    />
                                )}
                            />
                            {errors.email && <Text color="red.500">{errors.email.message}</Text>}
                        </FormControl>

                        <FormControl isInvalid={errors.address}>
                            <FormControl.Label>Address</FormControl.Label>
                            <Controller
                                control={control}
                                name="address"
                                rules={{ required: 'Address is required' }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        placeholder="Enter your address"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="words"
                                    />
                                )}
                            />
                            {errors.address && <Text color="red.500">{errors.address.message}</Text>}
                        </FormControl>

                        <FormControl isInvalid={errors.phone_number}>
                            <FormControl.Label>Phone Number</FormControl.Label>
                            <Controller
                                control={control}
                                name="phone_number"
                                rules={{
                                    required: 'Phone number is required',
                                    pattern: {
                                        value: /^[0-9]{10,15}$/,
                                        message: 'Invalid phone number format'
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        placeholder="Enter your phone number"
                                        keyboardType="phone-pad"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.phone_number && <Text color="red.500">{errors.phone_number.message}</Text>}
                        </FormControl>

                        <FormControl>
                            <FormControl.Label>Date of Birth</FormControl.Label>
                            <Input
                                w="100%"
                                value={selectedDob ? dateFormat(selectedDob, "mmmm dd, yyyy") : ''}
                                defaultValue={selectedDob ? dateFormat(selectedDob, "mmmm dd, yyyy") : ''}
                                placeholder="Select your date of birth"
                                isReadOnly={true}
                                InputRightElement={
                                    <Button size="xl" rounded="none" w="1/6" h="full" onPress={showDatePicker}>
                                        Date
                                    </Button>
                                }
                            />
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                                minimumDate={minDate}
                                date={selectedDob}
                            />
                        </FormControl>


                        <FormControl >
                            <FormControl.Label>Classification</FormControl.Label>
                            <Controller
                                control={control}
                                name="classification"
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        placeholder="Select classification (optional)"
                                        selectedValue={value}
                                        onValueChange={(itemValue) => onChange(itemValue || null)}
                                    >
                                        <Select.Item label="None" value="" />
                                        {classificationOptions.map(option => (
                                            <Select.Item key={option.value} label={option.label} value={option.value} />
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>


                        <FormControl isInvalid={errors.password}>
                            <FormControl.Label>Password</FormControl.Label>
                            <Controller
                                control={control}
                                name="password"
                                rules={{ required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        placeholder="Enter your password"
                                        type={showPassword ? "text" : "password"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="none"
                                        InputRightElement={
                                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                <Ionicons
                                                    name={showPassword ? "eye-off" : "eye"}
                                                    size={22}
                                                    color="#000"
                                                    style={{ marginRight: 10 }}
                                                />
                                            </TouchableOpacity>
                                        }
                                    />
                                )}
                            />
                            {errors.password && <Text color="red.500">{errors.password.message}</Text>}
                        </FormControl>

                        <FormControl isInvalid={errors.confirmPassword}>
                            <FormControl.Label>Confirm Password</FormControl.Label>
                            <Controller
                                control={control}
                                name="confirmPassword"
                                rules={{ required: 'Please confirm your password' }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        placeholder="Confirm your password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="none"
                                        InputRightElement={
                                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                <Ionicons
                                                    name={showConfirmPassword ? "eye-off" : "eye"}
                                                    size={22}
                                                    color="#000"
                                                    style={{ marginRight: 10 }}
                                                />
                                            </TouchableOpacity>
                                        }
                                    />
                                )}
                            />
                            {errors.confirmPassword && <Text color="red.500">{errors.confirmPassword.message}</Text>}
                        </FormControl>

                        <Button
                            isLoading={isLoading}
                            onPress={handleSubmit(onSubmit)}
                            backgroundColor="#080E2C"
                            style={styles.buttonRegister}
                        >
                            {isLoading ? (
                                <EvilIcons name="spinner" size={24} color="white" style={{ marginRight: 10 }} />
                            ) : (
                                "Register"
                            )}
                        </Button>
                    </VStack>
                </Box>
            </Center>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
    },
    logoContainer: {
        width: 300,
        height: 200,
    },
    logo: {
        flex: 1,
        width: undefined,
        height: undefined,
        resizeMode: 'contain',
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
    orText: {
        marginHorizontal: 1,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    registerLink: {
        marginTop: 10,
    },
    buttonRegister: {
        marginBottom: 40,
        height: 45
    }
});
