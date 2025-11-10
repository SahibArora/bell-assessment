// cart routes here we will handle SF logic as well, which is very minimal in this scope

import express from "express";
import { CartService } from "../service/cartService.ts";
import { CartStore } from "../store/cartStore";
import { SalesforceCartClient } from "../salesforce/salesforceCartClient.ts";

const router = express.Router();

const store = new CartStore();
const service = new CartService(store);
const sfClient = new SalesforceCartClient(120); // 2min TTL

// we will create a SF context here, in real-time it will SF's REST API
router.post("/", (req, res) => {
  const cart = store.createCart();
  const sfContext = sfClient.createContext();
  res.json({ cartId: cart.id, sfContextId: sfContext.id, expiresAt: cart.expiresAt });
});

// in real-time, we might fetch cart from SF to sync data
router.get("/:id", (req, res) => {
  try {
    const cart = service.getCart(req.params.id);
    res.json(cart);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

router.post("/:id/items", (req, res) => {
  try {
    const { sku, name, quantity, price } = req.body;
    if (!sku || !name || !quantity || !price)
      return res.status(400).json({ error: "Invalid item data" });

    const updated = service.addItem(req.params.id, { sku, name, quantity, price });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/:id/items/:itemId", (req, res) => {
  try {
    const { quantity } = req.body;
    const updated = service.updateItem(req.params.id, req.params.itemId, quantity);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id/items/:itemId", (req, res) => {
  try {
    const updated = service.removeItem(req.params.id, req.params.itemId);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
