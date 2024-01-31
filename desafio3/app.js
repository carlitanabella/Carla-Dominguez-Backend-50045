// App antes de cambiarlo
const express = require("express");
const app = express();
const PUERTO = 8080;

const ProductManager = require("./controllers/Products-Manager");
const CartManager = require("./controllers/Cart-Manager"); 
const productManager = new ProductManager("../src/models/products.json");
const cartManager = new CartManager();

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
    product ? res.status(201).send(product) : res.status(404).send(`Producto con id:${pId} no funciona`);
})

app.post("/api/products", async (req,res)=>{
    const newProduct = req.body;
    await manager.addProduct(newProduct);
    res.status(201).send({status:"success", message: "Product added successfully "})
})
app.put("/api/products/:pid", async (req, res) => {
    let id = req.params.pid; 
    const productoActualizado = req.body;

    try {
        await productManager.updateProduct(parseInt(id), productoActualizado);
        res.json({message: "Product actualizado", error})
    } catch (error) {
        console.log("no se actualizo", error);
        res.status(500).json({error: "error server"})
    }

})

app.delete('/api/user/:pid', (req, res) => {
    let id = req.params.pid;
    let currentLength = users.length;

    users = users.filter(user => user.first_id!=pid);
    if(users.length---currentLength) {
        return res.status(404).send ({message: "error", error})
    }
    res.send({status:"success", message: "eliminado"})
})


app.post("/api/carts", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error("Error al crear el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.get("/api/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            res.status(200).json(cart.products);
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener productos del carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta para agregar un producto al carrito específico
app.post("/api/carts/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const product = await productManager.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const updatedCart = await cartManager.addProductToCart(cartId, productId);
        res.status(201).json(updatedCart);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});

// app.post("/api/products", async(req, res)=> {
//     const nuevoProducto = req.body;

//     try {
//         await productManager.addProduct(nuevoProducto)
//         res.status(201).json({message:"product agregado"})
//     } catch (error) {
//         console.log("error", error);
//         res.status(500).json({error:"error del servi"});
//     }
// })


// app.post("/api/products", async(req, res)=> {
//     const nuevoProducto = req.body;

//     try {
//         await productManager.addProduct(nuevoProducto)
//         res.status(201).json({message:"product agregado"})
//     } catch (error) {
//         console.log("error", error);
//         res.status(500).json({error:"error del servi"});
//     }
// })