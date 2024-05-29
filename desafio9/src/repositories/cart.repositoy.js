const CartModel = require("../models/cart.model.js")

class CartRepository {
    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel ({ products:[]});
            await nuevoCarrito
            
        } catch (error) {

            throw new Error ("Error");
            
        }
    }
    async obtenerProductosDelCarrito(idCarrito){
        try {
            const carrito = await CartModel
        } catch (error) {
            
        }
    }
    async agreagarProducto(cartId, productId, quantity = 1) {
        try {
            const Carrito = await this.obtenerProductosDelCarrito(cartId);
            const existeProducto = carrito.products.find(item => item.product._id.toString() === productId);
            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {

            }

        } catch (error) {
            
        }
    }
    async eliminarProducto(cartId, productId) {
        try {
            const carrito = await CartModel.findById(cartId);
            if (!carrito) {
                throw new Error ("Carrito no encontrado");
            }

            Carrito.products = carrito.products.filter(item => item.product._id)
        } catch (error) {
            
        }
    }
    async actualizarProductoEnCarrito(cartId, updatedProduct){
        try {
            const carrito = await CartModel.findById(cartId);

            if(!carrito) {
                throw new Error("carrito no encontrado")
            }
            carrito.products = updateProducts;
            carrito.markModified("products");
            await carrito.save();
            return carrito;

        } catch (error) {
            throw new Error ();
        }
    }
    async actualizarCantidadesEnCaarrito(cartId, productId, newQuantity) {
        try {
            const carrito = await CartModel.findById(cartId);
            if(!carrito) {
                throw new Error("carrito no encontrado")
            }

            const productoIndex = carrito.products.findIndex(item => item.product._id.toString() === productId )
        } catch (error) {
            
        }
    }
    async vaciarCarrito(cartId) {
        try {
            const carrito = await CartModel.findById(
                cartId,
                { products: []},
                { new : true});
        } catch (error) {
            
        }
    }
}