import express from "express";
import routerCart from "./Routes/carts.routes.js";
import routerProd from "./Routes/productos.routes.js";

const express = require("express");
const PORT = 1080;
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const helper = require("./helpers/helper.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const userRouter = require("./Routes/user.router.js");
const sessionRouter = require("./Routes/session.router.js");

require("./database.js");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.use(session({
    secret: "secretcoder",
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 24 * 60 * 60 * 1000},
    store: MongoStore.create({
      mongoUrl:"mongodb+srv://vargasivanezequiel:coderhouse@cluster0.sybi3ex.mongodb.net/e-commerce?retryWrites=true&w=majority", ttl: 100
  })
  }))
  

app.engine("handlebars", exphbs.engine({  helpers: helper }));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas para productos y carritos
app.use("/api/products", routerProd);
app.use("/api/carts", routerCart);
app.use("/", viewsRouter);

app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);

// Manejador de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
    console.log(`Products API available at https://localhost:${PORT}/api/products`);
    console.log(`Carts API available at https://localhost:${PORT}/api/carts`);
});


const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

//array de productos: 
const ProductManager = require("./controllers/Products-Manager.js");
const productManager = new ProductManager("./src/models/products.json");

//server de Socket.io
const io = socket(httpServer);

io.on("connection", async (socket) => {
    console.log("Un cliente se conecto");

   
    socket.emit("productos", await productManager.getProducts());

    socket.on("eliminarProducto",  async (id) => {
        await productManager.deleteProduct(id);

    
        io.sockets.emit("productos", await productManager.getProducts());

    })

    //Agregar producto: 
    socket.on("agregarProducto", async (producto) => {
       console.log(producto);
       await productManager.addProduct(producto);
       io.sockets.emit("productos", await productManager.getProducts());
   })
    
})



