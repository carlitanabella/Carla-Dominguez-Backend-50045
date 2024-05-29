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

                const carrito = await this.getCarritoById(cartId);
                const existeProducto = carrito.products.find(item => item.product.toString() === productId);

                if(existeProducto) {
                    existeProducto.quantity += quantity;
                } else {
                    carrito.products.push({product: productId, quantity})
                }
                carrito.markModified("products");

                await carrito.save();
                return carrito;
            } catch (error) {
                console.log("Error al agregar un carrito por ID", error);
                throw error;
            }


    }

    async deleteDelCarrito (cartId, productId) {
        try {
          const carrito = await CartModel.findById(cartId);
          if (!cart) {
            throw "carrito no actualizado";
          } else {
            carrito.products = carrito.products.filter((e) => e.product != productId);
            carrito.markModified("products");
            await carrito.save();
            return carrito;
          }
        } catch (error) {
          console.log("Error al borrar producto de carrito", error);
          throw error;
        }
      }
    
      async deleteTodosProductosCarrito(cartId) {
        try {
          const carrito = await CartModel.findById(cartId);
          if (!carrito) {
            throw "Carrito no carga";
          } else {
            carrito.products = [];
            await carrito.save();
            return carrito;
          }
        } catch (error) {
          console.log("Error al limpiar  carrito", error);
          throw error;
        }
    }
    
}

module.exports = CartManager;