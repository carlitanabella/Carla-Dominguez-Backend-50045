const CartRepository = require("../repositories/cart.repository.js");
const ProductRepository = require("../repositories/product.repository.js");
const { generateUniqueCode, calcularTotal } = require("../utils/cartutils.js");

class CartController {
    constructor() {
        this.cartRepository = new CartRepository();
        this.productRepository = new ProductRepository();
    }

    async nuevoCarrito(req, res) {
        try {
            const nuevoCarrito = await this.cartRepository.crearCarrito();
            res.json(nuevoCarrito);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async obtenerProductosDeCarrito(req, res) {
        const carritoId = req.params.cid;
        try {
            const productos = await this.cartRepository.obtenerProductosDelCarrito(carritoId);
            res.json(productos);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async agregarProductoEnCarrito(req, res) {
        const carritoId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        try {
            await this.cartRepository.agregarProducto(carritoId, productId, quantity);
            res.send("Producto agregado correctamente");
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async eliminarProductoDeCarrito(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const carrito = await this.cartRepository.eliminarProducto(cartId, productId);
            res.json({
                status: "success",
                message: "Producto eliminado del carrito",
                carrito,
            });
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async actualizarProductosEnCarrito(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const carrito = await this.cartRepository.actualizarProductosEnCarrito(cartId, productId);
            res.json({
                status: "success",
                message: "Productos actualizados en el carrito",
                carrito,
            });
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async actualizarCantidades(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.newQuantity;

        try {
            const updatedCart = await this.cartRepository.actualizarProductosEnCarrito(cartId, productId, newQuantity);
            res.json({
                status: 'success',
                message: 'Cantidad actualizada correctamente',
                updatedCart,
            });
        } catch (error) {
            res.status(500).send("Error al actualizar la cantidad de productos");
        }
    }

    async vaciarCarrito(req, res) {
        const cartId = req.params.cid;
        try {
            const carrito = await this.cartRepository.vaciarCarrito(cartId);
            res.json({
                status: 'success',
                message: 'Todos los productos del carrito fueron eliminados correctamente',
                carrito,
            });
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async finalizarCompra(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await this.cartRepository.obtenerProductosDeCarrito(cartId);
            const products = cart.products;

            const productosNoDisponibles = [];

            for (const item of products) {
                const productId = item.product;
                const product = await this.productRepository.obtenerProductoPorId(productId);
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    productosNoDisponibles.push(productId);
                }
            }

            const userWithCart = await UserModel.findOne({ cart: cartId });

            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calcularTotal(cart.products),
                purchaser: userWithCart._id
            });
            await ticket.save();

            cart.products = cart.products.filter(item => !productosNoDisponibles.some(productId => productId.equals(item.product)));

            await cart.save();

            res.status(200).json({ productosNoDisponibles });
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

module.exports = CartController;
