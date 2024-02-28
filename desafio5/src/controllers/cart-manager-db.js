const CartModel = require("../models/cart.model.js")

class CartManager {
    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({products: []});
            await nuevoCarrito.save();
            return nuevoCarrito;

        } catch (error) {
            console.log("Error al crear el carrito", error);
            throw error;
        }
    }
    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId);
            if(!carrito) {
                console.log("No hay carrito con ese ID");
                return null;
            }

            return carrito;
        } catch (error) {
            console.log ("Error al obtener un carrito por ID", error);
            throw error;
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {

            try {

            } catch (error) {
                console.log("Error al obtener un carrito por ID", error);
                throw error;
            }


    }
    
}