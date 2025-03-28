'use client';

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';

let preloadedState = {};
if (typeof window !== 'undefined') {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    preloadedState = { cart: JSON.parse(savedCart) };
  }
}

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState,
});

if (typeof window !== 'undefined') {
  store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem('cart', JSON.stringify(state.cart));
  });
}
