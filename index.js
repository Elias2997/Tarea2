const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const PRODUCTOS_FILE = path.join(__dirname, 'productos.json');

app.use(express.json());

// Función auxiliar para leer productos del archivo JSON
async function leerProductos() {
  try {
    const data = await fs.readFile(PRODUCTOS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Función auxiliar para guardar productos en el archivo JSON
async function guardarProductos(productos) {
  await fs.writeFile(PRODUCTOS_FILE, JSON.stringify(productos, null, 2), 'utf8');
}

// Función de validación de producto
function validarProducto(producto, esActualizacion = false) {
  const errores = [];

  if (!esActualizacion && !producto.nombre) {
    errores.push('El campo nombre es obligatorio');
  }

  if (producto.nombre !== undefined && producto.nombre.trim() === '') {
    errores.push('El campo nombre no puede estar vacío');
  }

  if (producto.precio !== undefined) {
    if (typeof producto.precio !== 'number' || producto.precio <= 0) {
      errores.push('El precio debe ser un número positivo mayor a cero');
    }
  } else if (!esActualizacion) {
    errores.push('El campo precio es obligatorio');
  }

  if (producto.descripcion !== undefined) {
    if (typeof producto.descripcion !== 'string' || producto.descripcion.length < 10) {
      errores.push('La descripción debe tener un mínimo de 10 caracteres');
    }
  } else if (!esActualizacion) {
    errores.push('El campo descripción es obligatorio');
  }

  if (producto.disponible !== undefined && typeof producto.disponible !== 'boolean') {
    errores.push('El campo disponible debe ser un valor booleano (true o false)');
  }

  return errores;
}

// GET /productos - Obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
    const productos = await leerProductos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer los productos', detalle: error.message });
  }
});

// GET /productos/disponibles - Obtener productos disponibles
app.get('/productos/disponibles', async (req, res) => {
  try {
    const productos = await leerProductos();
    const disponibles = productos.filter(p => p.disponible === true);
    res.json(disponibles);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer los productos', detalle: error.message });
  }
});

// GET /productos/:id - Obtener un producto por ID
app.get('/productos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productos = await leerProductos();
    const producto = productos.find(p => p.id === id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el producto', detalle: error.message });
  }
});

// POST /productos - Crear un nuevo producto
app.post('/productos', async (req, res) => {
  try {
    const errores = validarProducto(req.body);

    if (errores.length > 0) {
      return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
    }

    const productos = await leerProductos();

    // Generar nuevo ID
    const nuevoId = productos.length > 0
      ? Math.max(...productos.map(p => p.id)) + 1
      : 1;

    const nuevoProducto = {
      id: nuevoId,
      nombre: req.body.nombre.trim(),
      precio: req.body.precio,
      descripcion: req.body.descripcion,
      disponible: req.body.disponible !== undefined ? req.body.disponible : true,
      fecha_ingreso: new Date().toISOString()
    };

    productos.push(nuevoProducto);
    await guardarProductos(productos);

    res.status(201).json({
      mensaje: 'Producto creado exitosamente',
      producto: nuevoProducto
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto', detalle: error.message });
  }
});

// PUT /productos/:id - Actualizar un producto
app.put('/productos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productos = await leerProductos();
    const indice = productos.findIndex(p => p.id === id);

    if (indice === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const errores = validarProducto(req.body, true);

    if (errores.length > 0) {
      return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
    }

    // Actualizar solo los campos proporcionados
    const productoActualizado = {
      ...productos[indice],
      ...(req.body.nombre !== undefined && { nombre: req.body.nombre.trim() }),
      ...(req.body.precio !== undefined && { precio: req.body.precio }),
      ...(req.body.descripcion !== undefined && { descripcion: req.body.descripcion }),
      ...(req.body.disponible !== undefined && { disponible: req.body.disponible })
    };

    productos[indice] = productoActualizado;
    await guardarProductos(productos);

    res.json({
      mensaje: 'Producto actualizado exitosamente',
      producto: productoActualizado
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto', detalle: error.message });
  }
});

// DELETE /productos/:id - Eliminar un producto
app.delete('/productos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productos = await leerProductos();
    const indice = productos.findIndex(p => p.id === id);

    if (indice === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const productoEliminado = productos.splice(indice, 1)[0];
    await guardarProductos(productos);

    res.json({
      mensaje: 'Producto eliminado exitosamente',
      producto: productoEliminado
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto', detalle: error.message });
  }
});

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`API de gestión de productos lista para usar`);
});
