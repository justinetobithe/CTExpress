import React from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { Text, Input, Center, Stack, Box, FormControl, Link, Button } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import NetInfo from '@react-native-community/netinfo';
import useAuthStore from '../store/authStore';
import Toast from '../components/Toast';
import { sendLocalNotification } from '../core/NotificationService';
import PushNotification from 'react-native-push-notification';

export default function LoginScreen({ navigation }) {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });
    const { isLoading, login } = useAuthStore();
    const { showToast } = Toast();

    const onLogin = (data) => {
        const state = NetInfo.fetch();
        if (state.isConnected) {
            showToast("No internet connection", "error");
        } else {

            login(data.email, data.password, showToast);
        }
    };

    const greetUser = () => {
        sendLocalNotification("This is a test notification!")

        // PushNotification.createChannel(
        //     {
        //         channelId: '3',
        //         channelName: 'name',
        //     },
        //     created => console.log(`createChannel returned '${created}'`),
        // );

        // PushNotification.localNotification({
        //     title: 'NEW Message - ANDROID',
        //     message: "test",
        //     channelId: '3',
        // });
    };

    return (
        <ScrollView style={styles.container}>
            <Center>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/img/logo.png')}
                        style={styles.logo}
                    />
                </View>
            </Center>

            <Box w="100%" maxWidth="300px" mx="auto">
                <Stack space={4} mx="4" mt="4">
                    <FormControl isRequired isInvalid={!!errors.email}>
                        <FormControl.Label>Email</FormControl.Label>
                        <Controller
                            control={control}
                            name="email"
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address"
                                }
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    size="sm"
                                    placeholder="Email"
                                    onBlur={onBlur}
                                    onChangeText={(text) => onChange(text)}
                                    value={value}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            )}
                        />
                        {errors.email && <FormControl.ErrorMessage>{errors.email.message}</FormControl.ErrorMessage>}
                    </FormControl>

                    <FormControl isRequired isInvalid={!!errors.password}>
                        <FormControl.Label>Password</FormControl.Label>
                        <Controller
                            control={control}
                            name="password"
                            rules={{
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    size="sm"
                                    placeholder="Password"
                                    onBlur={onBlur}
                                    onChangeText={(text) => onChange(text)}
                                    value={value}
                                    secureTextEntry
                                    autoCapitalize='none'
                                />
                            )}
                        />
                        {errors.password && <FormControl.ErrorMessage>{errors.password.message}</FormControl.ErrorMessage>}
                    </FormControl>

                    <Button
                        onPress={handleSubmit(onLogin)}
                        variant="solid"
                        backgroundColor="#080E2C"
                        isLoading={isLoading}
                        style={styles.buttonLogin}
                    >
                        Login
                    </Button>


                    <View style={styles.divider}>
                        <View style={styles.line} />
                        <Text style={styles.orText}>or</Text>
                        <View style={styles.line} />
                    </View>
                    {/* 
                    <Button variant="outline" width="100%" onPress={() => showToast("Available soon!", "info")}>
                        <View style={styles.googleButton}>
                            <Image source={require('../assets/img/google.png')} style={styles.googleIcon} />
                            <Text>Login with Google</Text>
                        </View>
                    </Button> */}

                    <Link onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
                        Create an account
                    </Link>

                    {/* <Button
                        onPress={greetUser}  // Calls the function to send the notification
                        variant="solid"
                        backgroundColor="#34b7f1"
                        style={styles.buttonGreeting}
                    >
                        Send Greeting Notification
                    </Button> */}
                </Stack>
            </Box>
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
    buttonLogin: {
        height: 45
    }
});
