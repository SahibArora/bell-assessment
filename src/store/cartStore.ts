// local memory

import { CartContext } from "../type/cart.ts";
import { v4 as uuidv4 } from "uuid";

export class CartStore {
  // map allows fast lookup, insertion, deletion
  private carts = new Map<string, CartContext>();

  // creates cart in local memory with expiration
  createCart(ttlMs = 300000): CartContext {
    const id = uuidv4();
    const cart: CartContext = { id, items: [], expiresAt: Date.now() + ttlMs };
    this.carts.set(id, cart);
    return cart;
  }

  getCart(id: string): CartContext | null {
    const cart = this.carts.get(id);
    if (!cart) return null;
    if (Date.now() > cart.expiresAt) {
      this.carts.delete(id);
      throw new Error("Cart expired");
    }
    return cart;
  }

  updateCart(cart: CartContext) {
    this.carts.set(cart.id, cart);
  }

  deleteCart(id: string) {
    this.carts.delete(id);
  }
}