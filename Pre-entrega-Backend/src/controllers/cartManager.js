import { promises as fs } from "fs";

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.cartId = 0;
        this.loadCarts();
    }

    loadCarts = async () => {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.cartId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.error("Error!", error);
            await this.saveCarts();
        }
    };

    saveCarts = () => {
        return fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    };

    addCart = async () => {
        const newCart = {
            id: ++this.cartId,
            products: []
        };
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    };

    getCartsById = async (cId) => {
        try {
            const cart = this.carts.find(cart => cart.id === cId);
            if (!cart) {
                console.log(`Cart con id:${cId} no funca`);
                return null;
            }
            return cart;
        } catch (error) {
            console.error("unable", error);
            throw error;
        }
    };

    addProductToCart = async (cId, pId, quantity = 1) => {
        try {
            const cart = await this.getCartsById(cId);
            const product = cart.products.find(prod => prod.id === pId);
            if (product) {
                product.quantity += quantity;
            } else {
                cart.products.push({ id: pId, quantity });
            }
            await this.saveCarts();
            return cart;
        } catch (error) {
            console.error("Unable", error);
            throw error;
        }
    };
}

export default CartManager;
