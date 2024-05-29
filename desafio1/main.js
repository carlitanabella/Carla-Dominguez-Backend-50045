class ProductManage {
    static ultId = 0;

    constructor () {
        this.products = [

        ]
    }
    addProduct (title, price, description, img, code, stock) {
        if (!title|| !price || !description || !img || !code || !stock) {
            console.log("todos son obligatorios campeon");
            return
        }
        if (this.products.some(item => item.code === code ) ) {
            console.log("codigo unico perra!");
            return;
        }
        // return this.products
        const newProduct = {
            id: ++ProductManage.ultId,
            title,
            price,
            description,
            img,
            code,
            stock,
        }
        this.products.push(newProduct)

    }
    getProducts() {
        return this.products;
    }
    getProductById (id) {
        const product = this.products.find( item = item.id === id);
        if (!product) {
            console.error("no funciono")

        }
        else {
            console.log(product)
        }

    }
}

const manager = new ProductManage();

console.log(manager.getProducts());

manager.addProduct("Producto prueba","esto es un producto prueba", 200,"sin imagen", "abc123", 25);

console.log(manager.getProducts());

manager.addProduct("Producto ba","esto es un producto prueba", 500,"sin imagen",  40);

console.log(manager.getProducts());

manager.addProduct("Producto ba","esto es un producto prueba", 500,"sin imagen",  40);