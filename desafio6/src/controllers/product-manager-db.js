const ProductModel = require ("../models/product.model");

class ProductManager {
    async addProduct ({title, description, price, img, code, stock, category, thumbails})
    {
        try { 
            if(!title || !description || !price || !code || !stock || !category)
        {console.log("Todos los campos son obligatorios");
        return;
        }
        const existeProducto = await ProductModel.findOne({code: code});

        if(existeProducto) {
            console.log("El codigo debe ser unico");
            return;
        }
        const nuevoProducto = new ProductModel({
            title,
            description,
            price,
            img,
            code,
            stock,
            category,
            status: true,
            thumbnails: thumbnails || []
        });
            await nuevoProducto.save();
            return nuevoProducto;
        }
        catch (error) {

            console.log("Error agregar producto", error);
            throw error;
        }
    }

    async getProducts({limit = 10, page = 1, sort, query }) {
        const limit = queryObject.limit;
        const page = queryObject.page;
        const sort = queryObject.sort;
        const query = queryObject.query;
        let productos;
        try {
            let produ = {
                limit: limit || 10,
                page: page || 1,
                lean: true
              };
              if (sort) {
                produ.sort = { price: sort };
              }
              if (query) {
                productos = await ProductModel.paginate({ category: query }, produ);
              } else {
                productos = await ProductModel.paginate({}, produ);
              }
              productos.prevLink = this.handleQueryString(
                queryObject,
                productos.prevPage
              );
              productos.nextLink = this.handleQueryString(
                queryObject,
                productos.nextPage
              );
            return productos;
        } catch (error) {
            console.log("Error al recuperar los productos", error);
            throw error;
        }
    }

    handleQueryString(queryObject, value) {
        if (value) {
          const queryProdu = Object.keys(queryObject).map((key) =>
          {
            if (key === "page") {
                return `page= ${valor}`;
            } else {
                return `${key} = ${queryObject[key]}`;
            }
        });
          console.log("queryString:", queryProdu);
          if (!queryObject.page) {
            queryProdu.push(`page=${value}`);
          }
          return "/api/products/view?" + queryProdu.join("&");
        }
        return null;
      }
    
    
      async getProductsLean() {
        try {
          const productos = await ProductModel.find().lean();
          return productos;
        } catch (error) {
          throw error;
        }
      }
    

    async getProductById(id) {
        try {
            const producto = await ProductModel.findById(id);
            if(!producto) {
                console.log(" Producto encontrado ");
                return null;
            }
            console.log("producto find");
            return producto;
        } catch (error) {
            console.log("Error al find producto by ID", error);
            throw error;
        }
    }

    async updateProduct(id, productoActualizado) {
        try {
            const updateProduct = await ProductModel.findByIdAndUpdate(id, productoActualizado);
            if(!updateProduct) {
                console.log("Producto no encontrado");
                return null;
            }
            console.log("Producto actualizado");
            return updateProduct;
        }
        catch (error) {
            console.log("Error al actualizar producto by ID", error);
            throw error;

        }
    }

    async deleteProduct(id) {
        try {
            const deleteProduct = await ProductModel.findByIdAndDelete(id);
            if(!deleteProduct) {
                console.log("Producto no encontrado");
                return null;
            }
            console.log("Producto eliminado");

        }
        catch (error) {
            console.log("Error al eliminar producto by ID", error);
            throw error;

        }
    }
}

module.exports = ProductManager;