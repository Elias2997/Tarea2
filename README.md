# API de Gestión de Productos

API RESTful desarrollada con Node.js y Express para gestionar un catálogo de productos de una tienda.

## Requisitos

- Node.js
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
https://github.com/Elias2997/Tarea2.git

cd api-gestion-productos
```

2. Instalar las dependencias:
```bash
npm install
```

## Ejecución

### Modo producción:
```bash
npm start
```

### Modo desarrollo (con nodemon para auto-reload):
```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`
```
## Rutas Disponibles

### 1. Obtener todos los productos
- **Método:** `GET`
- **Ruta:** `/productos`
- **Descripción:** Retorna un listado con todos los productos
- **Respuesta exitosa:** `200 OK`

**Ejemplo:**
```bash
curl http://localhost:3000/productos
```

### 2. Obtener un producto por ID
- **Método:** `GET`
- **Ruta:** `/productos/:id`
- **Descripción:** Retorna la información del producto con el ID especificado
- **Respuesta exitosa:** `200 OK`
- **Respuesta de error:** `404 Not Found` si el producto no existe

**Ejemplo:**
```bash
curl http://localhost:3000/productos/1
```

### 3. Obtener productos disponibles
- **Método:** `GET`
- **Ruta:** `/productos/disponibles`
- **Descripción:** Retorna únicamente los productos marcados como disponibles
- **Respuesta exitosa:** `200 OK`

**Ejemplo:**
```bash
curl http://localhost:3000/productos/disponibles
```

### 4. Crear un nuevo producto
- **Método:** `POST`
- **Ruta:** `/productos`
- **Descripción:** Permite agregar un nuevo producto
- **Respuesta exitosa:** `201 Created`
- **Respuesta de error:** `400 Bad Request` si los datos son inválidos

**Body requerido:**
```json
{
  "nombre": "Nombre del producto",
  "precio": 99.99,
  "descripcion": "Descripción mínima de 10 caracteres",
  "disponible": true
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Monitor Samsung 24\"",
    "precio": 199.99,
    "descripcion": "Monitor Full HD de 24 pulgadas con panel IPS y 75Hz",
    "disponible": true
  }'
```

### 5. Actualizar un producto
- **Método:** `PUT`
- **Ruta:** `/productos/:id`
- **Descripción:** Permite modificar los datos de un producto existente
- **Respuesta exitosa:** `200 OK`
- **Respuesta de error:** `404 Not Found` si el producto no existe, `400 Bad Request` si los datos son inválidos

**Body (todos los campos son opcionales):**
```json
{
  "nombre": "Nuevo nombre",
  "precio": 149.99,
  "descripcion": "Nueva descripción del producto",
  "disponible": false
}
```

**Ejemplo:**
```bash
curl -X PUT http://localhost:3000/productos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "precio": 799.99,
    "disponible": true
  }'
```

### 6. Eliminar un producto
- **Método:** `DELETE`
- **Ruta:** `/productos/:id`
- **Descripción:** Elimina un producto con base en su ID
- **Respuesta exitosa:** `200 OK`
- **Respuesta de error:** `404 Not Found` si el producto no existe

**Ejemplo:**
```bash
curl -X DELETE http://localhost:3000/productos/1
```

## Modelo de Datos

Cada producto tiene la siguiente estructura:

```javascript
{
  "id": 1,                                    // Número único (generado automáticamente)
  "nombre": "Nombre del producto",            // String (requerido)
  "precio": 99.99,                            // Number > 0 (requerido)
  "descripcion": "Descripción del producto",  // String mín. 10 caracteres (requerido)
  "disponible": true,                         // Boolean (por defecto: true)
  "fecha_ingreso": "2025-01-15T10:30:00.000Z" // ISO 8601 (generado automáticamente)
}
```
#Manejo de errores

La API maneja los siguientes códigos de estado HTTP:

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Datos inválidos o campos faltantes
- `404 Not Found`: Producto no encontrado
- `500 Internal Server Error`: Error del servidor

Todas las respuestas de error incluyen un objeto JSON con detalles:

```json
{
  "error": "Descripción del error",
  "detalles": ["Lista de errores específicos (si aplica)"]
}
```

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución JavaScript
- **Express**: Framework web minimalista y flexible
- **File System (fs)**: Módulo nativo de Node.js para manejo de archivos

## Autor

Elias

