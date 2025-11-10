// cart service layer, connects to db which is local storage here

import { CartContext, CartItem } from "../type/cart.ts";
import { CartStore } from "../store/cartStore";

export class CartService {
  constructor(private store: CartStore) {}

  getCart(cartId: string): CartContext {
    const cart = this.store.getCart(cartId);
    if (!cart) throw new Error("Cart not found");
    return cart;
  }

  // check if exists already qty++
  addItem(cartId: string, item: Omit<CartItem, "id">): CartContext {
    const cart = this.getCart(cartId);
    const existing = cart.items.find((i) => i.sku === item.sku);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.items.push({ ...item, id: crypto.randomUUID() });
    }
    this.store.updateCart(cart);
    return cart;
  }

  updateItem(cartId: string, itemId: string, quantity: number): CartContext {
    const cart = this.getCart(cartId);
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new Error("Item not found");
    item.quantity = quantity;
    this.store.updateCart(cart);
    return cart;
  }

  removeItem(cartId: string, itemId: string): CartContext {
    const cart = this.getCart(cartId);
    cart.items = cart.items.filter((i) => i.id !== itemId);
    this.store.updateCart(cart);
    return cart;
  }
}
