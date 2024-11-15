import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AppDrawer from '../components/AppDrawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { TouchableOpacity, Alert } from 'react-native';
import useAuthStore from '../store/authStore';
import PaymentScreen from '../screens/Payment/PaymentScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HistoryScreen from '../screens/History/HistoryScreen';
import BookingList from '../screens/Booking/BookingList';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function DrawerStack({ navigation }) {

    const { userInfo } = useAuthStore();

    return (
        <Drawer.Navigator
            drawerContent={props => <AppDrawer {...props} />}
            initialRouteName="Home"
            screenOptions={{
                drawerActiveBackgroundColor: '#080E2C',
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#333',
                drawerLabelStyle: {
                    marginLeft: -25,
                    fontFamily: 'Roboto-Medium',
                    fontSize: 15,
                },
            }}>
            <Drawer.Screen
                name="Home Screen"
                component={HomeScreen}
                options={{
                    title: "Home",
                    drawerIcon: ({ color }) => (
                        <Ionicons name="home-outline" size={22} color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: '#080E2C',
                    },
                    headerTitleStyle: {
                        color: '#fff',
                    },
                    headerTintColor: "#fff",
                }}
            />
            {/* {
                userInfo.role === "passenger" && (
                    <Drawer.Screen
                        name="PaymentScreen"
                        component={PaymentScreen}
                        options={{
                            title: "Payment Methods",
                            drawerIcon: ({ color }) => (
                                <MaterialIcons name="payment" size={22} color={color} />
                            ),
                            headerStyle: {
                                backgroundColor: '#080E2C',
                            },
                            headerTitleStyle: {
                                color: '#fff',
                            },
                            headerTintColor: "#fff",
                        }}
                    />
                )
            } */}
            {
                userInfo.role === "passenger" && (
                    <Drawer.Screen
                        name="BookingList"
                        component={BookingList}
                        options={{
                            title: "Bookings",
                            drawerIcon: ({ color }) => (
                                <MaterialCommunityIcons name="book-account" size={22} color={color} />
                            ),
                            headerStyle: {
                                backgroundColor: '#080E2C',
                            },
                            headerTitleStyle: {
                                color: '#fff',
                            },
                            headerTintColor: "#fff",
                        }}
                    />
                )
            }
            {
                userInfo.role === "passenger" && (
                    <Drawer.Screen
                        name="HistoryScreen"
                        component={HistoryScreen}
                        options={{
                            title: "History",
                            drawerIcon: ({ color }) => (
                                <MaterialIcons name="history" size={22} color={color} />
                            ),
                            headerStyle: {
                                backgroundColor: '#080E2C',
                            },
                            headerTitleStyle: {
                                color: '#fff',
                            },
                            headerTintColor: "#fff",
                        }}
                    />
                )
            }
            {/* <Drawer.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    drawerIcon: ({ color }) => (
                        <Ionicons name="person-outline" size={22} color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: "#080E2C",
                    },
                    headerTitleStyle: {
                        color: '#fff',
                    },
                    headerTintColor: "#fff",
                    headerRight: () => (
                        <TouchableOpacity onPress={() => { navigation.navigate("EditProfileScreen") }}>
                            <MaterialCommunityIcons name="account-edit" size={22} color="#fff" style={{ marginRight: 15 }} />
                        </TouchableOpacity>
                    ),
                }}
            /> */}
        </Drawer.Navigator>
    );
}
