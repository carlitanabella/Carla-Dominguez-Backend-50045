const CartRepository = require ("../repositories/cart.repositoy.js");
const CartRepository = new CartRepository();


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
                status: "sucess";
                message: "carrito act";
                carrito

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
                status: "sucess";
                message: "carrito act";
                carrito

            }) 

            
        } catch (error) {
            
        }
    }
    async actualizarCantidades(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.newQuantity;

        try {
            
        } catch (error) {
            
        }
    }
    async vaciarCarrito(req, res){
        
    }

}


module.exports = CartController;