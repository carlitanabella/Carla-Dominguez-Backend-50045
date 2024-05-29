import express from "express";
import routerCart from "./Routes/carts.routes.js";
import routerProd from "./Routes/productos.routes.js";
import exphbs from "express-handlebars";
import { Server as socket } from "socket.io";
import helper from "./helpers/helper.js";
import addLogger from "./utils/logger.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import userRouter from "./Routes/user.router.js";
import sessionRouter from "./Routes/session.router.js";
import usuariosRouter from "./Routes/usuarios.router.js";
import manejadorError from "./middleware/error.js";
import compression from "express-compression"; 
import ProductManager from "./controllers/Products-Manager.js";
import viewsRouter from "./Routes/views.router.js";
import './database.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.use(session({
    secret: "secretcoder",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://vargasivanezequiel:coderhouse@cluster0.sybi3ex.mongodb.net/e-commerce?retryWrites=true&w=majority",
        ttl: 100
    })
}));

app.engine("handlebars", exphbs.engine({ helpers: helper }));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas para productos y carritos
app.use("/api/products", routerProd);
app.use("/api/carts", routerCart);
app.use("/", viewsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/usuarios", usuariosRouter);
app.use(manejadorError);

// Manejador de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const httpServer = app.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
    console.log(`Products API available at https://localhost:${PORT}/api/products`);
    console.log(`Carts API available at https://localhost:${PORT}/api/carts`);
});

// Servidor de Socket.io
const io = new socket(httpServer);
const productManager = new ProductManager("./src/models/products.json");

io.on("connection", async (socket) => {
    console.log("Un cliente se conectó");
    socket.emit("productos", await productManager.getProducts());

    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        io.sockets.emit("productos", await productManager.getProducts());
    });

    socket.on("agregarProducto", async (producto) => {
        console.log(producto);
        await productManager.addProduct(producto);
        io.sockets.emit("productos", await productManager.getProducts());
    });
});

app.get("/loggerTest", (req, res) => {
    req.logger.error("Vamos a morir");
    req.logger.warning("Cuidado! Hombre radiactivo!");
    req.logger.info("Estamos navegando la app");
    res.send("Logs generados!");
});

app.get("/operacionsimple", (req, res) => {
    let suma = 0;
    for (let i = 0; i < 1000000; i++) {
        suma += i;
    }
    res.send({ suma });
});

app.get("/operacioncompleja", (req, res) => {
    let suma = 0;
    for (let i = 0; i < 5e8; i++) {
        suma += i;
    }
    res.send({ suma });
});
