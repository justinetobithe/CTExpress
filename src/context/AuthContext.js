import React, { createContext, useEffect } from 'react';
import useAuthStore from '../store/authStore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const {
        userInfo,
        isLoading,
        splashLoading,
        register,
        login,
        logout,
        updateUser,
        isLoggedIn,
    } = useAuthStore();

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                userInfo,
                splashLoading,
                register,
                login,
                logout,
                updateUser,
            }}>
            {children}
        </AuthContext.Provider>
    );
};
