// src/context/NotificationContext.js
import React, { createContext, useContext } from 'react';
import { sendLocalNotification } from '../core/NotificationService';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const notify = (message, title) => {
        sendLocalNotification(message, title);
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
        </NotificationContext.Provider>
    );
};
