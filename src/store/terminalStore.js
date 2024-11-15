import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

const useTerminalStore = create((set) => ({
    terminals: [],
    isLoading: false,
    error: null,

    fetchTerminals: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/api/terminals');
            console.log('fetchTerminals response:', res.data.data);
            set({ terminals: res.data.data });
        } catch (e) {
            console.log(`fetchTerminals error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addTerminal: async (name, latitude, longitude) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post('/api/terminal', { name, latitude, longitude });
            if (res.data.status === true) {
                set((state) => ({
                    terminals: [...state.terminals, res.data.data],
                }));
            }
        } catch (e) {
            console.log(`addTerminal error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updateTerminal: async (id, name, latitude, longitude) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.put(`/api/terminal/${id}`, { name, latitude, longitude });
            if (res.data.status === true) {
                set((state) => ({
                    terminals: state.terminals.map((terminal) =>
                        terminal.id === id ? { ...terminal, name, latitude, longitude } : terminal
                    ),
                }));
            }
        } catch (e) {
            console.log(`updateTerminal error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteTerminal: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.delete(`/api/terminal/${id}`);
            if (res.data.status === true) {
                set((state) => ({
                    terminals: state.terminals.filter((terminal) => terminal.id !== id),
                }));
            }
        } catch (e) {
            console.log(`deleteTerminal error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useTerminalStore;
