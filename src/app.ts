// server

import express from "express";
import cartRoutes from "./routes/cartRoutes.ts";

const PORT = process.env.PORT || 9000;

const app = express();
app.use(express.json()); // parse JSON
app.use(express.urlencoded({ extended: true })); // parse x-www-form-urlencoded bodies

// cart routes
app.use("/cart", cartRoutes);

// root api
app.get("/", (req, res) => res.send("Cart API running"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
