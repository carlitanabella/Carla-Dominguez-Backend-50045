const express = require("express");
const app = express();
const PUERTO = 8080;

const ProductManager = require("../src/controllers/Products-Manager");
const productManager = new ProductManager("../src/models/products.json");

app.use(express.json());

app.get("/", (req,res)=>{
    res.status(200).send("Welcomeeeee");
})

app.get("/api/products", async (req,res)=>{
    const {limit} = req.query;
    const products = await manager.getProducts();
    limit ? res.status(200).send(products.slice(0,limit)) : res.status(200).send(products);
})

app.get("/api/products/:pId", async (req,res)=>{
    let pId = req.params.pId
    const product = await manager.getProductById(parseInt(pId));
    product ? res.status(201).send(product) : res.status(404).send(`Product with id:${pId} not founded`);
})

app.post("/api/products", async (req,res)=>{
    const newProduct = req.body;
    await manager.addProduct(newProduct);
    res.status(201).send({status:"success", message: "Product added successfully "})
})

app.listen(PORT, ()=>{
    console.log(`Listening on https://localhost:${PORT}`);
});

