import { create } from 'zustand';
import api from '../api';

const usePaymentStore = create((set) => ({
    payments: [],
    isLoading: false,
    error: null,
    currentPayment: null,
    checkoutUrl: null,
    paymentIntentId: null,
    resetCheckoutUrl: () => { set({ checkoutUrl: null, paymentIntentId: null }); },

    checkout: async (formData, showToast) => {
        set({ isLoading: true, error: null, checkoutUrl: null, paymentIntentId: null });

        console.log("Form Data:", formData);
        try {
            const res = await api.post('/api/payment/checkout', formData);

            if (res.data.url) {
                console.log("Checkout URL:", res.data.url);
                set({ checkoutUrl: res.data.url, paymentIntentId: res.data.payment_intent_id });

                return res.data.url;
            } else {
                throw new Error("No checkout URL provided by the server.");
            }
        } catch (error) {
            console.error("Checkout error:", error.message);
            showToast(`Payment initiation failed: ${error.message}`, "error");
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default usePaymentStore;
