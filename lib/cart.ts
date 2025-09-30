"use client";

import { StaticImageData } from 'next/image';
/*import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MenuItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (menuItem: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateInstructions: (itemId: string, instructions: string) => void;
  clearCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (menuItem, quantity = 1, specialInstructions = '') => {
        set((state) => {
          // Check if the item is already in the cart
          const existingItemIndex = state.items.findIndex(
            item => item.menuItem.id === menuItem.id
          );
          
          if (existingItemIndex >= 0) {
            // If item exists, update quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += quantity;
            
            // If special instructions were provided, update them
            if (specialInstructions) {
              updatedItems[existingItemIndex].specialInstructions = specialInstructions;
            }
            
            return { items: updatedItems };
          }
          
          // If item doesn't exist, add it
          return {
            items: [
              ...state.items,
              {
                menuItem,
                quantity,
                specialInstructions
              }
            ]
          };
        });
      },
      
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter(item => item.menuItem.id !== itemId)
        }));
      },
      
      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items.map(item =>
            item.menuItem.id === itemId
              ? { ...item, quantity }
              : item
          )
        }));
      },
      
      updateInstructions: (itemId, instructions) => {
        set((state) => ({
          items: state.items.map(item =>
            item.menuItem.id === itemId
              ? { ...item, specialInstructions: instructions }
              : item
          )
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      }
    }),
    {
      name: 'shopping-cart'
    }
  )
);*/

// lib/cart.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Side {
  id: string;
  name: string;
  additionalPrice: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | StaticImageData;
  category: string;
  popular?: boolean;
  vegetarian?: boolean;
  spicy?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
  selectedSide?: Side;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: MenuItem, quantity: number, selectedSide?: Side) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  removeItem: (itemId: string) => void;
  updateInstructions: (itemId: string, instructions: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (menuItem, quantity, selectedSide) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            item => item.menuItem.id === menuItem.id && 
            item.selectedSide?.id === selectedSide?.id
          );

          if (existingItemIndex !== -1) {
            // Mettre à jour la quantité si l'article existe déjà
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += quantity;
            return { items: updatedItems };
          } else {
            // Ajouter un nouvel article
            const newItem: CartItem = {
              menuItem,
              quantity,
              selectedSide
            };
            return { items: [...state.items, newItem] };
          }
        });
      },
      
      updateQuantity: (itemId, newQuantity) => {
        set((state) => ({
          items: state.items.map(item =>
            item.menuItem.id === itemId 
              ? { ...item, quantity: newQuantity }
              : item
          )
        }));
      },
      
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter(item => item.menuItem.id !== itemId)
        }));
      },
      
      updateInstructions: (itemId, instructions) => {
        set((state) => ({
          items: state.items.map(item =>
            item.menuItem.id === itemId 
              ? { ...item, specialInstructions: instructions }
              : item
          )
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const itemPrice = item.menuItem.price + (item.selectedSide?.additionalPrice || 0);
          return total + (itemPrice * item.quantity);
        }, 0);
      },
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);