# APIs del Backend

Base URL predeterminada: `http://localhost:8080`

## Autenticación (`/api/auth`)
| Método | Ruta | Descripción | Body esperado |
| --- | --- | --- | --- |
| POST | `/register` | Registra un nuevo usuario y retorna un `AuthResponse` con token. | `RegisterRequest`
| POST | `/login` | Autentica un usuario existente y retorna un `AuthResponse` con token. | `AuthRequest`

## Pedidos (`/api/pedidos`)
| Método | Ruta | Descripción | Body esperado |
| --- | --- | --- | --- |
| POST | `/` | Crea un pedido junto a sus detalles. | `CreatePedidoDTO`
| GET | `/` | Lista todos los pedidos registrados. | N/A

## Productos (`/api/productos`)
| Método | Ruta | Descripción | Body esperado |
| --- | --- | --- | --- |
| GET | `/` | Obtiene todos los productos. | N/A
| GET | `/{id}` | Obtiene un producto por su ID. | N/A
| POST | `/` | Crea un nuevo producto. | `Producto`
| PUT | `/{id}` | Actualiza un producto existente. | `Producto`
| DELETE | `/{id}` | Elimina un producto. | N/A

## Usuarios (`/api/usuarios`)
| Método | Ruta | Descripción | Body esperado |
| --- | --- | --- | --- |
| GET | `/` | Lista todos los usuarios. | N/A
| GET | `/{id}` | Obtiene un usuario por ID. | N/A
| POST | `/` | Crea un nuevo usuario. | `Usuario`
| PUT | `/{id}` | Actualiza un usuario existente. | `Usuario`
| DELETE | `/{id}` | Elimina un usuario. | N/A

> Todos los endpoints aceptan solicitudes CORS desde cualquier origen según las anotaciones `@CrossOrigin("*")` en los controladores.
