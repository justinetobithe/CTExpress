import { create } from 'zustand';
import api from '../api';

const usePassengerStore = create((set) => ({
    passengers: [],
    isLoading: false,
    error: null,
    currentPassenger: null,

    fetchPassengers: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/api/passengers');
            console.log('fetchPassengers response:', res.data.data);
            set({ passengers: res.data.data });
        } catch (e) {
            console.error(`fetchPassengers error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addPassenger: async (formData, showToast, navigation) => {
        set({ isLoading: true, error: null });

        console.log("form Data", formData);
        try {
            const res = await api.post('/api/passenger', formData);

            if (res.data.status) {
                set((state) => ({
                    passengers: [...state.passengers, res.data.data],
                }));
                showToast(res.data.message, "success");
                navigation.goBack();
            } else {
                console.log("Backend error:", res.data.message);
                showToast(res.data.message, "error");
            }
        } catch (e) {
            console.error(`addPassenger error: ${e}`);
            showToast(`Failed to add passenger: ${e.message}`, "error");
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    showPassenger: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get(`/api/passenger/${id}`);
            console.log(`showPassenger response for ID ${id}:`, res.data.data);
            if (res.data.status) {
                set({ currentPassenger: res.data.data });
            }
        } catch (e) {
            console.error(`showPassenger error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updatePassenger: async (id, formData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.put(`/api/passenger/${id}`, formData);
            if (res.data.status) {
                set((state) => ({
                    passengers: state.passengers.map((passenger) =>
                        passenger.id === id ? { ...passenger, ...res.data.data } : passenger
                    ),
                }));
            }
        } catch (e) {
            console.error(`updatePassenger error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    deletePassenger: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.delete(`/api/passenger/${id}`);
            if (res.data.status) {
                set((state) => ({
                    passengers: state.passengers.filter((passenger) => passenger.id !== id),
                }));
            }
        } catch (e) {
            console.error(`deletePassenger error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    confirmPassenger: async (id, showToast) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.put(`/api/passenger/${id}/confirm`);
            if (res.data.status) {
                set((state) => ({
                    passengers: state.passengers.map((passenger) =>
                        passenger.id === id ? { ...passenger, confirmed: true } : passenger
                    ),
                }));
                showToast(res.data.message, "success");
            } else {
                console.log("Backend error:", res.data.message);
                showToast(res.data.message, "error");
            }
        } catch (e) {
            console.error(`confirmPassenger error: ${e}`);
            showToast(`Failed to confirm passenger: ${e.message}`, "error");
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    cancelPassenger: async (id, showToast) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.put(`/api/passenger/${id}/cancel`);
            if (res.data.status) {
                set((state) => ({
                    passengers: state.passengers.map((passenger) =>
                        passenger.id === id ? { ...passenger, confirmed: false } : passenger
                    ),
                }));
                showToast(res.data.message, "success");
            } else {
                console.log("Backend error:", res.data.message);
                showToast(res.data.message, "error");
            }
        } catch (e) {
            console.error(`cancelPassenger error: ${e}`);
            showToast(`Failed to cancel passenger: ${e.message}`, "error");
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default usePassengerStore;
