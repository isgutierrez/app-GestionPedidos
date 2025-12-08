-- Elimina el esquema si ya existe (opcional)
DROP DATABASE IF EXISTS mydb;

-- Crea el esquema
CREATE DATABASE mydb DEFAULT CHARACTER SET utf8;
USE mydb;

-- Tabla Cliente
CREATE TABLE cliente (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100),
  telefono VARCHAR(20),
  UNIQUE (correo)
);

-- Tabla Usuario
CREATE TABLE usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  correo VARCHAR(100),
  nombre VARCHAR(100) NOT NULL,
  contraseña VARCHAR(255) NOT NULL,
  rol ENUM('cocinero', 'cajero', 'administrador', 'soporte') NOT NULL,
  UNIQUE (correo)
);

-- Tabla Producto
CREATE TABLE producto (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  imagen VARCHAR(255),
  categoria VARCHAR(50) NOT NULL
);

-- Tabla Pedido
CREATE TABLE pedido (
  id_pedido INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATETIME NOT NULL,
  estado ENUM('pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado') NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  id_cliente INT,
  id_mesa INT,
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

-- Tabla DetallePedido
CREATE TABLE detallePedido (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  observaciones TEXT,
  FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
  FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

-- Tabla Pago
CREATE TABLE pago (
  id_pago INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL,
  metodo_pago ENUM('efectivo', 'tarjeta', 'billetera_digital') NOT NULL,
  estado_pago ENUM('pendiente', 'exitoso', 'fallido') NOT NULL,
  fecha_pago DATETIME NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
);

-- Tabla HistorialPedido
CREATE TABLE historialPedido (
  id_historial INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL,
  estado ENUM('pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado') NOT NULL,
  fecha_cambio_estado DATETIME NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
);

-- Tabla Notificación
CREATE TABLE notificacion (
  id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL,
  mensaje TEXT,
  fecha_envio DATETIME,
  tipo ENUM('cliente', 'cocina', 'sistema'),
  FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
);

-- Tabla Reporte
CREATE TABLE reporte (
  id_reporte INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  fecha_generacion DATETIME NOT NULL,
  generado_por INT,
  archivo VARCHAR(255) NOT NULL,
  FOREIGN KEY (generado_por) REFERENCES usuario(id_usuario)
);
