import { Router } from "express";
import ProductManager from "../controllers/product-manager-db.js";

const routerProd = Router();
const pManager = new ProductManager();

routerProd.get("/", async (req, res) => {
    const { limit } = req.query;
    try {
        const products = await pManager.getProducts();
        if (products) {
            limit ? res.status(200).json(products.slice(0, limit)) : res.status(200).json(products);
        } else {
            res.status(400).send("No hay productos creados");
        }
    } catch (error) {
        console.error("Unable obtain the products", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

routerProd.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await pManager.getProductsById(id);
        if (!product) {
            return res.status(404).json({ error: "Product nooo funciona" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Unable obtain the product", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

routerProd.post("/", async (req, res) => {
    const newProduct = req.body;
    try {
        await pManager.addProduct(newProduct);
        res.status(200).json({ message: "Product added successfully" });
    } catch (error) {
        console.error("Unable to add the product", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

routerProd.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const updatedInfo = req.body;
    try {
        await pManager.updateProduct(id, updatedInfo);
        res.status(200).json({ message: "Product updated successfully!" });
    } catch (error) {
        console.error("Unable to update the current product", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

routerProd.delete("/:pid", async (req, res) => {
    const { pId } = req.params;
    try {
        await pManager.deleteProduct(id);
        res.status(200).json({ message: "el producto select fue eliminado" });
    } catch (error) {
        console.error("algo salio mal eliminar prod", error);
        res.status(500).json({ error: "error internal server" });
    }
});

export default routerProd;
