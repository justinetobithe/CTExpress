import { create } from 'zustand';
import api from '../api';

const useVehicleStore = create((set) => ({
    vehicles: [],
    isLoading: false,
    error: null,

    fetchVehicles: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/api/vehicles');
            console.log('fetchVehicles response:', res.data.data);
            set({ vehicles: res.data.data });
        } catch (e) {
            console.error(`fetchVehicles error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addVehicle: async (driver_id, license_plate, brand, model, year, capacity) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post('/api/vehicle', {
                driver_id,
                license_plate,
                brand,
                model,
                year,
                capacity,
            });

            if (res.data.status) {
                set((state) => ({
                    vehicles: [...state.vehicles, res.data.data],
                }));
            }
        } catch (e) {
            console.error(`addVehicle error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updateVehicle: async (id, driver_id, license_plate, brand, model, year, capacity) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.put(`/api/vehicle/${id}`, {
                driver_id,
                license_plate,
                brand,
                model,
                year,
                capacity,
            });

            if (res.data.status) {
                set((state) => ({
                    vehicles: state.vehicles.map((vehicle) =>
                        vehicle.id === id ? { ...vehicle, ...res.data.data } : vehicle
                    ),
                }));
            }
        } catch (e) {
            console.error(`updateVehicle error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteVehicle: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.delete(`/api/vehicle/${id}`);
            if (res.data.status) {
                set((state) => ({
                    vehicles: state.vehicles.filter((vehicle) => vehicle.id !== id),
                }));
            }
        } catch (e) {
            console.error(`deleteVehicle error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchVehiclesByDriver: async (driverId) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get(`/api/vehicle/driver/${driverId}`);
            console.log('fetchVehiclesByDriver response:', res.data.data);
            set({ vehicles: res.data.data });
        } catch (e) {
            console.error(`fetchVehiclesByDriver error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

}));

export default useVehicleStore;
