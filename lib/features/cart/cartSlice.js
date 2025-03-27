"use client"

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
  totalAmount: 0,
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, quantity } = action.payload
      const existingItem = state.items.find((item) => item.id === id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push(action.payload)
      }

      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)

      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },
    incrementQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload)
      if (item) {
        item.quantity += 1

        state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
      }
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload)
      if (item && item.quantity > 1) {
        item.quantity -= 1

        state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
      }
    },
    clearCart: (state) => {
      state.items = []
      state.totalAmount = 0
    },
  },
})

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions

export default cartSlice.reducer

