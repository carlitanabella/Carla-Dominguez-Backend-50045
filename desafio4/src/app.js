import express from "express";
import routerCart from "./Routes/carts.routes.js";
import routerProd from "./Routes/productos.routes.js";

const express = require("express");
const PORT = 8080;
const app = express();
const exphbs = require("express-handlebars");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas para productos y carritos
app.use("/api/products", routerProd);
app.use("/api/carts", routerCart);

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






