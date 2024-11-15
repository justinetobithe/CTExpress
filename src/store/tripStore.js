import { create } from 'zustand';
import api from '../api';

const useTripStore = create((set) => ({
    trips: [],
    isLoading: false,
    error: null,
    currentTrip: null,

    fetchTrips: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/api/trips');
            console.log('fetchTrips response:', res.data.data);
            set({ trips: res.data.data });
        } catch (e) {
            console.error(`fetchTrips error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addTrip: async (formData) => {
        set({ isLoading: true, error: null });
        try {

            console.log("formData", formData)

            const res = await api.post('/api/trip', formData);

            if (res.data.status) {
                set((state) => ({
                    trips: [...state.trips, res.data.data],
                }));
            }
        } catch (e) {
            console.error(`addTrip error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    showTrip: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get(`/api/trip/${id}`);
            console.log(`showTrip response for ID ${id}:`, res.data.data);
            if (res.data.status) {
                set({ currentTrip: res.data.data });
            }
        } catch (e) {
            console.error(`showTrip error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updateTrip: async (id, driver_id, vehicle_id, from_terminal_id, to_terminal_id, passenger_capacity, start_time, trip_date, fare_amount, status) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.put(`/api/trip/${id}`, {
                driver_id,
                vehicle_id,
                from_terminal_id,
                to_terminal_id,
                passenger_capacity,
                start_time,
                trip_date,
                fare_amount,
                status,
            });

            if (res.data.status) {
                set((state) => ({
                    trips: state.trips.map((trip) =>
                        trip.id === id ? { ...trip, ...res.data.data } : trip
                    ),
                }));
            }
        } catch (e) {
            console.error(`updateTrip error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteTrip: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.delete(`/api/trip/${id}`);
            if (res.data.status) {
                set((state) => ({
                    trips: state.trips.filter((trip) => trip.id !== id),
                }));
            }
        } catch (e) {
            console.error(`deleteTrip error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchDriverTrips: async (driverId, date) => {
        set({ isLoading: true, error: null });
        console.log(`Fetching trips for driver ID: ${driverId} with date: ${date}`);
        try {
            const url = date ? `/api/trip/driver/${driverId}?date=${date}` : `/api/trip/driver/${driverId}`;
            const res = await api.get(url);
            console.log(`fetchDriverTrip response for driver ${driverId}:`, res.data.data);
            set({ trips: res.data.data });
        } catch (e) {
            console.error(`fetchDriverTrip error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFutureTrips: async (from_terminal_id, to_terminal_id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get(`/api/trip/future/trips`, {
                params: {
                    from_terminal_id: from_terminal_id,
                    to_terminal_id: to_terminal_id,
                },
            });
            console.log('fetchFutureTrips response:', res.data.data);
            set({ trips: res.data.data });
        } catch (e) {
            console.error(`fetchFutureTrips error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updateTripStatus: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.put(`/api/trip/status/${id}`, {
                status: 'in_progress',
            });

            if (res.data.status) {
                set((state) => ({
                    trips: state.trips.map((trip) =>
                        trip.id === id ? { ...trip, status: 'in_progress' } : trip
                    ),
                }));
            }
        } catch (e) {
            console.error(`updateTripStatus error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updateDriverDecision: async (tripId, driverId, decision, showToast) => {
        set({ isLoading: true, error: null });
        try {
            console.log("tripId", tripId)
            console.log("driverId", driverId)
            console.log("decision", decision)

            const res = await api.put(`/api/trip/${tripId}/decision/${driverId}`, { decision });
            console.log('updateDriverDecision response:', res.data);

            if (res.data.status) {
                set((state) => ({
                    trips: state.trips.map((trip) =>
                        trip.id === tripId ? { ...trip, driver_decision: decision } : trip
                    ),
                }));
                showToast(res.data.message, "success");
            }
        } catch (e) {
            console.error(`updateDriverDecision error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

}));

export default useTripStore;
