const TicketModel = require("../models/ticket.model.js");
const UserModel = require("../models/user.model.js");
const CartRepository = require ("../repositories/cart.repositoy.js");
const CartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const { generateUniqueCode, calcularTotal } = require("../utils/cartutils.js");

const EmailManager = require("../service/email.js");
const emailManager = new EmailManager();

class CartController {
    async nuevoCarrito(req, res){
        try {
            const nuevoCarrito = await CartRepository.crearCarrito();
            res.json(nuevoCarrito);
        } catch (error) {
            res.status(500).send("Error");
            
        }
    }

    async obtenerProductosDeCarrito(req, res) {
        const carritoId = req.params.cid;
        try {
            const productos = await CartRepository.obtenerProductosDelCarrito(carritoId);

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
            await CartRepository.agregarProducto(cartid, productId, quantity);
            res.send("Prod Agregado");

        } catch (error) {
            res.status(500).send("Error");
        }

        
    }
    async eliminarProductoDeCarrito( req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const carrito = await CartRepository.eliminarProducto(cartId, productId);
            res.json({
                status: "sucess",
                message: "Eliminado del carrito",
                carrito,

            })
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async actualizarProductosEnCarrito(req, res){
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const carrito = await cartRepository.actualizarProductosEnCarrito(cartId, productId);
            res.json({
                status: "sucess",
                message: "Eliminado del carrito",
                carrito,

            }) 

            
        } catch (error) {
            res.status(500).send("Error");
        }
    }
    async actualizarCantidades(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.newQuantity;

        try {
            const carrito = await cartRepository.actualizarProductosEnCarrito(cartId, productId, newQuantity);
            res.json(carrito);

            res.json({
                status: 'success',
                message: 'Cantidad actualizada correctamente',
                updatedCart,
            });
            
        } catch (error) {
            res.status(500).send("Error actualizar cantidad de productos");
        }
    }
    async vaciarCarrito(req, res){
        const cartId = req.params.cid; 
        try {

        const carrito = await cartRepository.vaciarCarrito(cartId);

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
               
                const cart = await cartRepository.obtenerProductosDeCarrito(cartId);
                const products = cart.products;
    
                
                const productosNoDisponibles = [];
    
                
                for (const item of products) {
                    const productId = item.product;
                    const product = await productRepository.obtenerProductoPorId(productId);
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
    
              
                cart.products = cart.products.filter(item => productosNoDisponibles.some(productId => productId.equals(item.product)));
                  
            
                await cart.save();

                await emailManager.enviarCorreoCompra(userWithCart.email, userWithCart.first_name, ticket._id);

                res.render("checkout", {
                    cliente: userWithCart.first_name,
                    email: userWithCart.email,
                    numTicket: ticket._id
                });
    
            } catch (error) {
                console.error('Error al procesar la compra:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        }

}


module.exports = CartController;