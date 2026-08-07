import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './indexedDB';

interface POSState {
  currentSessionId: string | null;
  cart: CartItem[];
  isOnline: boolean;
  
  // Actions
  setSessionId: (id: string | null) => void;
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
  setOnlineStatus: (status: boolean) => void;
}

export const usePOSStore = create<POSState>()(
  persist(
    (set) => ({
      currentSessionId: null,
      cart: [],
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      
      setSessionId: (id) => set({ currentSessionId: id }),
      addToCart: (item) => set((state) => {
        const existing = state.cart.find((c) => c.dish_id === item.dish_id);
        if (existing) {
          return {
            cart: state.cart.map((c) => 
              c.dish_id === item.dish_id ? { ...c, quantity: c.quantity + 1 } : c
            )
          };
        }
        return { cart: [...state.cart, item] };
      }),
      clearCart: () => set({ cart: [] }),
      setOnlineStatus: (isOnline) => set({ isOnline }),
    }),
    { name: 'fs_pos_store' }
  )
);
