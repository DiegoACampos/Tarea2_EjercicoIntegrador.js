// Cada producto que vende el super es creado con esta clase
class Producto {
    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        // Si no me definen stock, pongo 10 por defecto
        if (!stock) {
            this.stock = 10;
        } else {
            this.stock = stock;
        }
    }
}

// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];

// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }

    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    async agregarProducto(sku, cantidad) {
        console.log(`Agregando ${cantidad} ${sku}`);

        const buscoEnCarritoFound = this.productos.find(producto => producto.sku === sku);

        if (buscoEnCarritoFound) {
            buscoEnCarritoFound.cantidad += cantidad;
        } else {
            // Busco el producto en la "base de datos"
            try {
                const producto = await findProductBySku(sku);
                console.log("Producto encontrado", producto);

                // Creo un producto nuevo
                const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
                this.productos.push(nuevoProducto);
                this.precioTotal += producto.precio * cantidad;
                const verificarCategoriaTrue = this.categorias.includes(producto.categoria);
                if (!verificarCategoriaTrue) {
                    this.categorias.push(producto.categoria);
                }
            } catch (error) {
                console.log(`Error: ${error}`);
            }
        }
    }

    eliminarProducto(sku, cantidad) {
        console.log(`Eliminando ${cantidad} ${sku}`);

        const existeProducto = this.productos.find(producto => producto.sku === sku);

        try {
            return new Promise((resolve, reject) => {
                if (existeProducto) {
                    if (cantidad < existeProducto.cantidad) {
                        existeProducto.cantidad -= cantidad;
                        this.precioTotal -= existeProducto.precio * cantidad;
                        resolve(`Se eliminaron ${cantidad} ${sku} del carrito.`);
                    } else {
                        this.productos = this.productos.filter(producto => producto.sku !== sku);
                        this.precioTotal -= existeProducto.precio * existeProducto.cantidad;
                        resolve(`Se eliminó ${cantidad} ${sku} del carrito.`);
                    }
                } else {
                    reject(`El producto ${sku} no existe en el carrito.`);
                }
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }
}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(producto => producto.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(`Product ${sku} not found`);
            }
        }, 1500);
    });
}

const carrito = new Carrito();
carrito.agregarProducto('WE328NJ', 2);
carrito.eliminarProducto('WE328NJ', 2)
    .then(resultado => {
        console.log(resultado);
    })
    .catch(error => {
        console.log(error);
    });
carrito.agregarProducto('WE328NJ', 2);
