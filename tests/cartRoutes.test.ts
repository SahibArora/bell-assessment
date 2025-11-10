import request from "supertest";
import express from "express";
import cartRoutes from "../src/routes/cartRoutes.ts";

const app = express();
app.use(express.json()); // json
app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
app.use("/cart", cartRoutes);

// test critical endpoints
describe("cart API endpoints test", () => {
  let cartId: string;
  let itemId: string;

  // Create a cart
  it("should create a new cart", async () => {
    // verify status + validate obj returned
    const res = await request(app).post("/cart");

    expect(res.status).toBe(200);
    expect(res.body.cartId).toBeDefined();
    expect(res.body.sfContextId).toBeDefined();
    cartId = res.body.cartId;
  });

  // Get cart
  it("should get the cart by ID", async () => {
    // verify status + validate obj returned
    const res = await request(app).get(`/cart/${cartId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(cartId);
    expect(res.body.items).toEqual([]);
  });

  // Add item to cart
  it("should add an item to the cart", async () => {
    // verify status + validate obj returned
    const res = await request(app)
      .post(`/cart/${cartId}/items`)
      .send({ sku: "plan-001", name: "Unlimited Talk & Text", quantity: 1, price: 50 });

    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].sku).toBe("plan-001");
    itemId = res.body.items[0].id;
  });

  // Update item quantity
  it("should update the quantity of an item", async () => {
    const res = await request(app)
      .patch(`/cart/${cartId}/items/${itemId}`)
      .send({ quantity: 2 });

    expect(res.status).toBe(200);
    const updatedItem = res.body.items.find((i: any) => i.id === itemId);
    expect(updatedItem.quantity).toBe(2);
  });

  // Delete item from cart
  it("should remove an item from the cart", async () => {
    const res = await request(app)
      .delete(`/cart/${cartId}/items/${itemId}`);
    expect(res.status).toBe(200);
    expect(res.body.items.find((i: any) => i.id === itemId)).toBeUndefined();
  });

  // Expired cart test
  it("should throw error for expired cart", async () => {
    const expiredRes = await request(app)
      .get("/cart/expired-id");
      
    expect(expiredRes.status).toBe(404);
    expect(expiredRes.body.error).toBeDefined();
  });
});
