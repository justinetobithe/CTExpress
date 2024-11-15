import { create } from 'zustand';
import api from '../api';

const useBookingStore = create((set) => ({
    bookings: [],
    isLoading: false,
    error: null,
    currentBooking: null,

    fetchBookings: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/api/bookings');
            console.log('fetchBookings response:', res.data.data);
            set({ bookings: res.data.data });
        } catch (e) {
            console.error(`fetchBookings error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addBooking: async (formData, showToast, navigation) => {
        set({ isLoading: true, error: null });

        console.log("form Data", formData);
        try {
            const res = await api.post('/api/booking', formData);

            if (res.data.status) {
                set((state) => ({
                    bookings: [...state.bookings, res.data.data],
                }));
                showToast(res.data.message, "success");
                navigation.goBack();
            } else {
                console.log("Backend error:", res.data.message);
                showToast(res.data.message, "error");
            }
        } catch (e) {
            console.error(`addBooking error: ${e}`);
            showToast(`Failed to add booking: ${e.message}`, "error");
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    showBooking: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get(`/api/booking/${id}`);
            console.log(`showBooking response for ID ${id}:`, res.data.data);
            if (res.data.status) {
                set({ currentBooking: res.data.data });
            }
        } catch (e) {
            console.error(`showBooking error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updateBooking: async (id, formData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.put(`/api/booking/${id}`, formData);
            if (res.data.status) {
                set((state) => ({
                    bookings: state.bookings.map((booking) =>
                        booking.id === id ? { ...booking, ...res.data.data } : booking
                    ),
                }));
            }
        } catch (e) {
            console.error(`updateBooking error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteBooking: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.delete(`/api/booking/${id}`);
            if (res.data.status) {
                set((state) => ({
                    bookings: state.bookings.filter((booking) => booking.id !== id),
                }));
            }
        } catch (e) {
            console.error(`deleteBooking error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchCurrentBookingForUser: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get(`/api/booking/current/${userId}`);
            console.log(`fetchCurrentBookingForUser response for User ID ${userId}:`, res.data.data);
            if (res.data.status) {
                set({ currentBooking: res.data.data });
            } else {
                set({ currentBooking: null });
                // console.error("No current booking found for the user.");
            }
        } catch (e) {
            console.error(`fetchCurrentBookingForUser error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    dropOffPassenger: async (id, formData, showToast) => {
        set({ isLoading: true, error: null });

        console.log("formData", formData);
        try {
            const res = await api.put(`/api/booking/drop-off/${id}`, { formData });

            console.log("response", res.data)

            // if (res.data.status) {
            //     set((state) => ({
            //         bookings: state.bookings.map((booking) =>
            //             booking.id === id ? { ...booking, ...res.data.booking } : booking
            //         ),
            //     }));
            //     showToast(res.data.message, "success");
            // } else {
            //     console.log("Backend error:", res.data.message);
            //     showToast(res.data.message, "error");
            // }
        } catch (e) {
            console.error(`dropOffPassenger error: ${e}`);
            showToast(`Failed to drop off passenger: ${e.message}`, "error");
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },


}));

export default useBookingStore;
