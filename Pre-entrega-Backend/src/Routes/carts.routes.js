import { Router } from "express";
import CartManager from "../controllers/cartManager.js";

const routerCart = Router();
const cManager = new CartManager("./src/models/carts.json");

routerCart.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cManager.getCartsById(parseInt(cid));
        if (cart) {
            res.status(200).json(cart.products);
        } else {
            res.status(404).json({ error: "Cart no funca" });
        }
    } catch (error) {
        console.error("Unable obtain cart", error);
        res.status(500).json({ error: "error inteerno" });
    }
});

routerCart.post("/", async (req, res) => {
    try {
        const newCart = await cManager.addCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error("Fallo", error);
        res.status(500).json({ error: "error interno" });
    }
});

routerCart.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity || 1;
    try {
        const cart = await cManager.addProductToCart(parseInt(cid), parseInt(pid), quantity);
        res.status(201).json(cart.products);
    } catch (error) {
        console.error("Unable to add the product to the cart", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default routerCart;