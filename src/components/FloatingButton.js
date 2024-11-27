
import React from 'react';
import { Fab } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FloatingButton = ({ onPress }) => {
    return (
        <Fab
            renderInPortal={false}
            shadow={2}
            size="sm"
            icon={<Ionicons name="add" size={22} color={"#ffffff"} />}
            onPress={onPress}
            bg="#080E2C"
        />
    );
};

export default FloatingButton;
