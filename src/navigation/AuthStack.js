import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import DrawerStack from './DrawerStack';
import useAuthStore from '../store/authStore';
import HistoryScreen from '../screens/History/HistoryScreen';
import PaymentScreen from '../screens/Payment/PaymentScreen';


import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AddTrip from '../screens/Trip/AddTrip';
import TripDetails from '../screens/Trip/TripDetails';
import Booking from '../screens/Booking/Booking';
import GCashScreen from '../screens/Payment/GCashScreen';
import PaymayaScreen from '../screens/Payment/PaymayaScreen';

const Stack = createStackNavigator();

export default function AuthStack() {

    const { userInfo } = useAuthStore();

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomeScreen"
                component={DrawerStack}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AddTrip"
                component={AddTrip}
                options={{
                    title: "Add New Trip",
                    drawerIcon: ({ color }) => (
                        <Ionicons name="book-outline" size={22} color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: "#080E2C",
                    },
                    headerTitleStyle: {
                        color: '#fff',
                    },
                    headerTintColor: "#fff",

                }}
            />
            <Stack.Screen
                name="TripDetails"
                component={TripDetails}
                options={{
                    title: "Trip Details",
                    drawerIcon: ({ color }) => (
                        <Ionicons name="book-outline" size={22} color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: "#080E2C",
                    },
                    headerTitleStyle: {
                        color: '#fff',
                    },
                    headerTintColor: "#fff",

                }}
            />
            <Stack.Screen
                name="Booking"
                component={Booking}
                options={{
                    title: "New Booking",
                    drawerIcon: ({ color }) => (
                        <Ionicons name="book-outline" size={22} color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: "#080E2C",
                    },
                    headerTitleStyle: {
                        color: '#fff',
                    },
                    headerTintColor: "#fff",

                }}
            />

            <Stack.Screen
                name="GCashScreen"
                component={GCashScreen}
                options={{
                    title: "GCash",
                    drawerIcon: ({ color }) => (
                        <Ionicons name="book-outline" size={22} color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: "#080E2C",
                    },
                    headerTitleStyle: {
                        color: '#fff',
                    },
                    headerTintColor: "#fff",

                }}
            />

            <Stack.Screen
                name="PaymayaScreen"
                component={PaymayaScreen}
                options={{
                    title: "Paymaya",
                    drawerIcon: ({ color }) => (
                        <Ionicons name="book-outline" size={22} color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: "#080E2C",
                    },
                    headerTitleStyle: {
                        color: '#fff',
                    },
                    headerTintColor: "#fff",

                }}
            />
        </Stack.Navigator>
    )
}
