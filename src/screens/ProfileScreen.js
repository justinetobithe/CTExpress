import React, { useContext, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { FormControl, Input, Image, Center } from "native-base";
import axios from 'axios';
import Layout from '../components/Layout';
import { BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import { ScrollView } from 'react-native';
import dateFormat from 'dateformat';

export default function ProfileScreen() {
    const { userInfo } = useContext(AuthContext);
    const [user, setUser] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/users/${userInfo.user.id}`);
            setUser(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchUser();
    };

    return (
        <ScrollView>
            <Layout>
                <Center>
                    <FormControl isInvalid mb="4">
                        <Center>
                            <Image size={150} borderRadius={100} source={require('../assets/img/avatar.png')} alt="Alternate Text" />
                        </Center>
                    </FormControl>
                    <FormControl isInvalid mb="4">
                        <FormControl.Label mb="2">Email</FormControl.Label>
                        <Input defaultValue={user.email} isDisabled={true} />
                    </FormControl>
                    <FormControl isInvalid mb="4">
                        <FormControl.Label mb="2">Name</FormControl.Label>
                        <Input defaultValue={user.name} isDisabled={true} />
                    </FormControl>
                    <FormControl isInvalid mb="4">
                        <FormControl.Label mb="2">Birthdate</FormControl.Label>
                        <Input defaultValue={dateFormat(user.birthdate, "mmmm dd, yyyy")} isDisabled={true} />
                    </FormControl>
                    <FormControl isInvalid mb="4">
                        <FormControl.Label mb="2">Gender</FormControl.Label>
                        <Input defaultValue={user.gender} isDisabled={true} />
                    </FormControl>
                    <FormControl isInvalid mb="4">
                        <FormControl.Label mb="2">Address</FormControl.Label>
                        <Input defaultValue={user.address} isDisabled={true} />
                    </FormControl>
                    <FormControl isInvalid mb="4">
                        <FormControl.Label mb="2">Phone Number</FormControl.Label>
                        <Input defaultValue={user.phone_number} isDisabled={true} />
                    </FormControl>
                </Center>
            </Layout>
        </ScrollView>
    );
}
