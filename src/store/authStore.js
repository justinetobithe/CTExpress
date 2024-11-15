import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api'; 
import dateFormat from "dateformat";

const useAuthStore = create((set) => ({
    userInfo: {},
    isLoading: false,
    splashLoading: false,

    register: async ({ first_name, last_name, email, address, phone_number, password, role, dob, classification, googleId = null, googleAvatar = null }) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append('first_name', first_name);
            formData.append('last_name', last_name);
            formData.append('email', email);
            formData.append('address', address);
            formData.append('phone', phone_number);
            formData.append('dob', dob ? dateFormat(dob, "yyyy-mm-dd") : '');
            formData.append('role', role);
            formData.append('classification', classification || '');

            if (googleId) {
                formData.append('google_id', googleId);
                formData.append('google_avatar', googleAvatar);
            } else {
                formData.append('password', password);
            }

            console.log("FormData being sent:", formData);

            const res = await api.post('/api/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.status === true) {
                set({ isLoading: false });
                return { success: true, message: res.data.message || 'Registration successful!' };
            } else {
                set({ isLoading: false });
                console.log("API response error:", res.data.message);
                return { success: false, message: res.data.message || 'Registration failed' };
            }
        } catch (e) {
            console.log(`Register error: ${e.response?.data || e.message}`);
            set({ isLoading: false });
            return { success: false, message: 'An error occurred during registration.' };
        }
    },


    login: async (email, password, showToast) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/api/login', { email, password });

            if (res.data.status === true) {
                const userInfo = {
                    ...res.data.data.user,
                    token: res.data.data.token
                };

                set({ userInfo });
                await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                showToast(res.data.message, "success");
            } else {
                showToast(res.data.message || "Login failed", "error");
            }
        } catch (e) {
            set({ isLoading: false });
            showToast(e.response.data.message || "Invalid email or password", "error");
            // console.log(`login error ${e}`);
        } finally {
            set({ isLoading: false });
        }
    },



    updateUser: async (id, currentPassword, newPassword, confirmPassword) => {
        set({ isLoading: true });
        try {
            const res = await api.put(`/api/user/${id}`, {
                currentPassword, newPassword, confirmPassword,
            });
            if (res.data.status === true) {
                console.log(res.data);
                useAuthStore.getState().logout();
            }
        } catch (e) {
            console.log(e.message);
        }
    },

    logout: async () => {
        set({ isLoading: true });
        const { userInfo } = useAuthStore.getState();
        try {
            await api.post('/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            });
            await AsyncStorage.removeItem('userInfo');
            set({ userInfo: {} });
            console.log("Logged out successfully.");
        } catch (e) {
            if (e.response?.status === 401) {
                console.log("Token expired or unauthorized. Proceeding with local logout.");
                await AsyncStorage.removeItem('userInfo');
                set({ userInfo: {} });
            } else {
                console.log(`logout error ${e}`);
            }
        } finally {
            set({ isLoading: false });
        }
    },



    isLoggedIn: async () => {
        set({ splashLoading: true });
        try {
            let userInfo = await AsyncStorage.getItem('userInfo');
            userInfo = JSON.parse(userInfo);
            if (userInfo) {
                set({ userInfo });
            }
        } catch (e) {
            console.log(`is logged in error ${e}`);
        } finally {
            set({ splashLoading: false });
        }
    },
}));

export default useAuthStore;
