import React from 'react'
import { NavigationContainer } from "@react-navigation/native"
import SplashScreen from '../screens/SplashScreen';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from '../navigation/AuthStack';
import AppStack from '../navigation/AppStack';
import useAuthStore from '../store/authStore';

const Stack = createStackNavigator();

const Navigation = () => {
    const { splashLoading, userInfo } = useAuthStore();

    return (
        <NavigationContainer>
            {
                userInfo ?
                    splashLoading ? (
                        <>
                            <Stack.Navigator>
                                <Stack.Screen
                                    name="SplashScreen"
                                    component={SplashScreen}
                                    options={{ headerShown: false }}
                                />
                            </Stack.Navigator>
                        </>
                    ) : userInfo.token ? (
                        <AuthStack />
                    ) : (
                        <AppStack />
                    )
                    : ""
            }

        </NavigationContainer>
    );
};

export default Navigation;


