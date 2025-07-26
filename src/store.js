import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  token: null,
  isLoading: true,
  cart: {},
  
  login: (sessionData) => {
    localStorage.setItem('apnaMandiSession', JSON.stringify(sessionData));
    set({ user: sessionData.user, token: sessionData.token });
  },
  logout: () => {
    localStorage.removeItem('apnaMandiSession');
    set({ user: null, token: null, cart: {} });
  },
  checkUserSession: () => {
    console.log('checkUserSession called');
    try {
      const session = localStorage.getItem('apnaMandiSession');
      console.log('Session from localStorage:', session ? 'Found' : 'Not found');
      if (session) {
        const sessionData = JSON.parse(session);
        console.log('Parsed session data:', sessionData);
        set({ user: sessionData.user, token: sessionData.token, isLoading: false });
      } else {
        console.log('No session found, setting isLoading to false');
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error checking user session:', error);
      localStorage.removeItem('apnaMandiSession');
      set({ isLoading: false });
    }
  },
  
  // Cart Logic
  addToCart: (productId) => set((state) => ({ cart: {...state.cart, [productId]: (state.cart[productId] || 0) + 1 } })),
  removeFromCart: (productId) => set((state) => {
    const newCart = {...state.cart };
    if (newCart[productId] > 1) newCart[productId] -= 1;
    else delete newCart[productId];
    return { cart: newCart };
  }),
  clearCart: () => set({ cart: {} }),
}));

export default useStore;
