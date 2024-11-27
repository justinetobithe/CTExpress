import React from 'react';
import {
    View,
    Text,
    ImageBackground,
    Image,
    TouchableOpacity,
} from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAuthStore from '../store/authStore';

const AppDrawer = props => {
    const { logout, userInfo } = useAuthStore();

    const handleLogout = () => {
        logout();
        // props.navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'Login' }]
        // });
    };

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ backgroundColor: '#080E2C' }}>
                <ImageBackground
                    source={require('../assets/img/menu-bg.png')}
                    style={{ padding: 20 }}>
                    <Image
                        source={require('../assets/img/avatar.png')}
                        style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }}
                    />
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 18,
                            fontFamily: 'Roboto-Medium',
                            marginBottom: 5,
                        }}>
                        {userInfo.first_name + " " + userInfo.last_name}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            style={{
                                color: '#fff',
                                fontFamily: 'Roboto-Regular',
                                marginRight: 5,
                            }}>
                            {userInfo.email}
                        </Text>
                    </View>
                </ImageBackground>
                <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
                <TouchableOpacity onPress={handleLogout} style={{ paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="exit-outline" size={22} color={"#000"} />
                        <Text
                            style={{
                                fontSize: 15,
                                fontFamily: 'Roboto-Medium',
                                marginLeft: 5,
                                color: "#000"
                            }}>
                            Sign Out
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AppDrawer;
