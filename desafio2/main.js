import { promises as fs } from "fs";

class ProductManager {

    static incrementId = 0;

    constructor() {
        this.products =[];
        this.path = './products.json';
        this.loadProducts();
    };

        loadProducts = async () => {
            try{
                this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
            } catch (error){ 
                console.error("Este no es un producto")
            }
        };

        saveProducts = async () =>{
            try{
                await fs.writeFile(this.path, JSON.stringify(this.products,null,2));
                console.log("Products saving succes!");
            }catch(error){
                console.erros('Error saving the products');
            };
        };


        addProduct = async (title,description,price,img,code,stock) =>{

            if(!title || !description || !price || !img || !code || !stock){
                console.log("All fields are mandatory");
                return;
            };
            if(this.products.some(item => item.code === code)){
                console.log(`The code ${code} already exist`);
                return;
            };

            const newProduct = {
                id: ++ProductManager.incrementId,
                title,
                description,
                price,
                img,
                code,
                stock
            };

            this.products.push(newProduct);
            
            await this.saveProducts()
        };

        getProducts(){
            return this.products;
        };

        getProductById(prodId){
            const product = this.products.find(product => product.id === prodId);
            if(!product){
                console.error("Product no sale");
            }else{
                console.log(product);
            };
        };

        updateProductById = async (prodId, updatedInfo) => {
            const index = this.products.findIndex(product => product.id === prodId);
            if (index === -1) {
                console.error(`Producto con ID ${prodId} no funca`);
                return;
            }
            this.products[index] = {...this.products[index], ...updatedInfo };
            await this.saveProducts();
            console.log(`Producto con ID ${prodId} actualizado `);
        };


        deleteProduct = async (prodId) =>{
            const updateProducts = this.products.filter(item => item.id != prodId);
            this.products = updateProducts;
            await this.saveProducts();
        };
        
            
};



const productManager = new ProductManager();

    