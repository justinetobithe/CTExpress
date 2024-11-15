import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import useAuthStore from '../store/authStore'

const Stack = createStackNavigator()

export default function AppStack() {

    return (
        <Stack.Navigator
            initialRouteName="StartScreen"
            screenOptions={{
                headerTransparent: false
            }}>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Home"
                component={AppStack}
                options={{
                    headerStyle: {
                        backgroundColor: 'transparent',
                    },
                    headerTitleStyle: {
                        color: 'transparent',
                    },
                }}
            />
        </Stack.Navigator>
    )
}
