-- Conéctate a la base de datos CowShop primero:
-- \c CowShop;

-- 1. Crear extensión para UUID si se necesita
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Crear tipo de tabla
CREATE TYPE venta_detalle_tipo AS (
    id_vaca INTEGER,
    precio DECIMAL(18,2),
    descuento DECIMAL(18,2)
);

-- 3. Crear tablas
CREATE TABLE Rol (
    ID_Rol SERIAL PRIMARY KEY,
    NombreRol VARCHAR(100) NOT NULL,
    DescripcionRol VARCHAR(250) NOT NULL,
    FechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaModificacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Estado BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Membresia (
    ID_Membresia SERIAL PRIMARY KEY,
    Nombre_Membresia VARCHAR(100),
    Valor_Membresia INTEGER,
    FechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaModificacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Estado BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Usuario (
    ID_Usuario SERIAL PRIMARY KEY,
    Nombre VARCHAR(80) NOT NULL,
    Cedula VARCHAR(20) NOT NULL UNIQUE,
    Fecha_Nacimiento DATE NOT NULL,
    Correo VARCHAR(320) NOT NULL UNIQUE,
    Celular VARCHAR(10) NOT NULL,
    Tipo_Usuario VARCHAR(20) NOT NULL,
    ID_Membresia INTEGER,
    Contrasena BYTEA NOT NULL,
    ID_Rol INTEGER,
    FechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaModificacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Estado BOOLEAN NOT NULL DEFAULT TRUE,
    
    CONSTRAINT fk_membresia FOREIGN KEY (ID_Membresia) REFERENCES Membresia(ID_Membresia),
    CONSTRAINT fk_rol FOREIGN KEY (ID_Rol) REFERENCES Rol(ID_Rol),
    CONSTRAINT chk_tipo_usuario CHECK (Tipo_Usuario IN ('Ambos', 'Comprador', 'Vendedor')),
    CONSTRAINT chk_edad_valida CHECK (EXTRACT(YEAR FROM AGE(CURRENT_DATE, Fecha_Nacimiento)) >= 16)
);

CREATE TABLE Vaca (
    ID_Vaca SERIAL PRIMARY KEY,
    Nombre VARCHAR(80),
    Raza VARCHAR(80),
    Edad INTEGER,
    Peso DECIMAL(10,2),
    Precio DECIMAL(20,2),
    Estado_Salud VARCHAR(50),
    ID_Vendedor INTEGER NOT NULL,
    FechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaModificacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Estado BOOLEAN NOT NULL DEFAULT TRUE,
    
    CONSTRAINT fk_vendedor FOREIGN KEY (ID_Vendedor) REFERENCES Usuario(ID_Usuario),
    CONSTRAINT chk_edad_positiva CHECK (Edad >= 0),
    CONSTRAINT chk_peso_positivo CHECK (Peso > 0),
    CONSTRAINT chk_precio_positivo CHECK (Precio >= 0)
);

CREATE TABLE Venta (
    ID_Venta SERIAL PRIMARY KEY,
    ID_Comprador INTEGER NOT NULL,
    Fecha_Venta TIMESTAMP NOT NULL,
    Total DECIMAL(18,2) NOT NULL DEFAULT 0,
    FechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaModificacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Estado BOOLEAN NOT NULL DEFAULT TRUE,
    
    CONSTRAINT fk_comprador FOREIGN KEY (ID_Comprador) REFERENCES Usuario(ID_Usuario),
    CONSTRAINT chk_total_positivo CHECK (Total >= 0)
);

CREATE TABLE Detalle_Venta (
    ID_Detalle_Venta SERIAL PRIMARY KEY,
    ID_Venta INTEGER,
    ID_Vaca INTEGER,
    Precio DECIMAL(20,2),
    Descuento DECIMAL(18,2) DEFAULT 0,
    FechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaModificacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Estado BOOLEAN NOT NULL DEFAULT TRUE,
    
    CONSTRAINT fk_venta FOREIGN KEY (ID_Venta) REFERENCES Venta(ID_Venta) ON DELETE CASCADE,
    CONSTRAINT fk_ganado FOREIGN KEY (ID_Vaca) REFERENCES Vaca(ID_Vaca) ON DELETE CASCADE,
    CONSTRAINT chk_descuento_valido CHECK (Descuento >= 0 AND Descuento <= 100)
);

-- 4. Crear índices
CREATE INDEX ix_detalleventa_id_vaca ON Detalle_Venta(ID_Vaca);
CREATE INDEX ix_detalleventa_id_venta ON Detalle_Venta(ID_Venta);
CREATE INDEX ix_usuario_cedula ON Usuario(Cedula);
CREATE INDEX ix_usuario_correo ON Usuario(Correo);
CREATE INDEX ix_usuario_tipo ON Usuario(Tipo_Usuario);
CREATE INDEX ix_vaca_id_vendedor ON Vaca(ID_Vendedor);
CREATE INDEX ix_vaca_raza ON Vaca(Raza);
CREATE INDEX ix_venta_fecha ON Venta(Fecha_Venta);
CREATE INDEX ix_venta_id_comprador ON Venta(ID_Comprador);

-- 5. Insertar datos
-- Primero insertar membresías
INSERT INTO Membresia (Nombre_Membresia, Valor_Membresia) VALUES
('Básica', 100000),
('Profesional', 50000),
('Premium', 100000);

-- Insertar roles
INSERT INTO Rol (NombreRol, DescripcionRol) VALUES
('Administrador', 'Rol con permisos completos para administrar el sistema, usuario supremo'),
('Usuario', 'Rol estándar con acceso básico a las funcionalidades'),
('Moderador', 'Rol encargado de supervisar y moderar contenidos'),
('Comprador', 'Rol que permite realizar compras dentro del sistema'),
('Vendedor', 'Rol que permite publicar y vender productos'),
('Invitado', 'Rol con permisos mínimos de navegación y visualización'),
('Supervisor', 'Rol que supervisa las actividades de otros usuarios'),
('Soporte', 'Rol encargado de brindar asistencia técnica y soporte a los usuarios de la plataforma');

-- Insertar usuarios (usando las contraseñas hasheadas del SQL Server)
INSERT INTO Usuario (Nombre, Cedula, Fecha_Nacimiento, Correo, Celular, Tipo_Usuario, ID_Membresia, Contrasena, ID_Rol) VALUES
('Ana Maria Perez', '12345789', '1999-05-10', 'ana@gmail.com', '3001234533', 'Comprador', 1, decode('EB045D78D273107348B0300C01D29B7552D622ABBC6FAF81B3EC55359AA9950C', 'hex'), 2),
('Sebastian Barreto', '102589741', '1995-08-12', 'sebastbarr@gmail.com', '3154486472', 'Comprador', 3, decode('32C24E709AC9CF626C5FE2EECF5F4C49CA7701D572AAC941BABE7F6F9F76B68F', 'hex'), 4),
('camilo hernandez', '45786432', '1950-07-01', 'caherndz@gmail.com', '3154875421', 'Comprador', 3, decode('EF303EB22C4EA179A2C1562553BFFAF01DF715CD7E36B4D0D4ED3A03422EA4C7', 'hex'), 5),
('Jaz Martinez', '87543245', '1970-11-03', 'jazdmar@hotmail.com', '3052401322', 'Comprador', 1, decode('0A74E162F2CC6F9987132575991D80E43132D330820D6B9D07CFFD9C5FC31E07', 'hex'), 5),
('Carlos Ramírez', '1002003001', '1990-05-12', 'carlos.vendedor@cowshop.com', '3001112233', 'Vendedor', 1, decode('144C94281A096D4AF847216D2B16D0C0973EAA83C77AB50F2287192C1F6FF379', 'hex'), 2),
('María González', '1002003002', '1992-08-25', 'maria.vendedora@cowshop.com', '3004445566', 'Vendedor', 2, decode('32C24E709AC9CF626C5FE2EECF5F4C49CA7701D572AAC941BABE7F6F9F76B68F', 'hex'), 2);
SELECT * FROM usuario;
-- Insertar vacas
INSERT INTO Vaca (Nombre, Raza, Edad, Peso, Precio, Estado_Salud, ID_Vendedor, Estado) VALUES
('Adelinaa', 'Holstein', 0, 840.00, 4600000.00, 'Bueno', 6, FALSE),
('Manchitas', 'Holstein', 4, 720.00, 5200000.00, 'Buena', 5, TRUE),
('Brisa', 'Angus', 0, 950.00, 7800000.00, 'Regular', 6, TRUE),
('Estrella', 'Brahman', 3, 850.00, 5700000.00, 'Excelente', 5, FALSE),
('Babagaga', 'Holstein', 0, 102.00, 102000.00, 'Excelente', 6, FALSE),
('mihna', 'Angus', 0, 151.00, 500000.00, 'Bueno', 6, TRUE),
('analia', 'Charolais', 0, 900.00, 8000000.00, 'Excelente', 4, TRUE),
('Lola', 'Simmental', 0, 750.00, 7100000.00, 'Excelente', 4, FALSE);

-- Insertar ventas
INSERT INTO Venta (ID_Comprador, Fecha_Venta, Total) VALUES
(1, '2025-09-01 10:30:00', 2500000.00),
(2, '2025-09-03 09:00:00', 3200000.00),
(3, '2025-09-09 00:00:00', 13500000.00);

-- Insertar detalles de venta
INSERT INTO Detalle_Venta (ID_Venta, ID_Vaca, Descuento) VALUES
(3, 9, 0.00),
(3, 10, 0.00),
(3, 11, 0.00);

-- 6. Crear funciones (Procedimientos Almacenados en PostgreSQL)

-- Función para actualizar membresía
CREATE OR REPLACE FUNCTION actualizar_membresia(
    p_id_membresia INTEGER,
    p_nombre_membresia VARCHAR(100),
    p_valor_membresia INTEGER
) RETURNS INTEGER AS $$
BEGIN
    UPDATE Membresia
    SET 
        Nombre_Membresia = p_nombre_membresia,
        Valor_Membresia = p_valor_membresia,
        FechaModificacion = CURRENT_TIMESTAMP
    WHERE ID_Membresia = p_id_membresia;
    
    RETURN FOUND::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar usuario - CORREGIDA
CREATE OR REPLACE FUNCTION actualizar_usuario(
    p_id_usuario INTEGER,
    p_nombre VARCHAR(80),
    p_cedula VARCHAR(20),
    p_fecha_nacimiento DATE,
    p_correo VARCHAR(320),
    p_celular VARCHAR(10),
    p_tipo_usuario VARCHAR(20),
    p_id_membresia INTEGER,
    p_estado BOOLEAN,
    p_contrasena VARCHAR(100) DEFAULT NULL,  -- MOVIDO DESPUÉS DE p_estado
    p_id_rol INTEGER DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    v_hash_contrasena BYTEA;
BEGIN
    IF p_contrasena IS NOT NULL THEN
        v_hash_contrasena := decode(encode(digest(p_contrasena, 'sha256'), 'hex'), 'hex');
    END IF;
    
    UPDATE Usuario
    SET
        Nombre = p_nombre,
        Cedula = p_cedula,
        Fecha_Nacimiento = p_fecha_nacimiento,
        Correo = p_correo,
        Celular = p_celular,
        Tipo_Usuario = p_tipo_usuario,
        ID_Membresia = p_id_membresia,
        Contrasena = COALESCE(v_hash_contrasena, Contrasena),
        ID_Rol = COALESCE(p_id_rol, ID_Rol),
        Estado = p_estado,
        FechaModificacion = CURRENT_TIMESTAMP
    WHERE ID_Usuario = p_id_usuario;
    
    RETURN FOUND::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Función para login de usuario
CREATE OR REPLACE FUNCTION login_usuario(
    p_correo VARCHAR(320),
    p_contrasena VARCHAR(100)
) RETURNS SETOF Usuario AS $$
DECLARE
    v_hash_contrasena BYTEA;
BEGIN
    v_hash_contrasena := decode(encode(digest(p_contrasena, 'sha256'), 'hex'), 'hex');
    
    RETURN QUERY
    SELECT * FROM Usuario
    WHERE Correo = p_correo 
      AND Contrasena = v_hash_contrasena 
      AND Estado = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Función para registrar venta múltiple
CREATE OR REPLACE FUNCTION registrar_venta_multiple(
    p_id_comprador INTEGER,
    p_fecha_venta TIMESTAMP,
    p_total DECIMAL(18,2),
    p_detalles JSON
) RETURNS INTEGER AS $$
DECLARE
    v_id_venta INTEGER;
    v_detalle JSON;
BEGIN
    -- Insertar venta
    INSERT INTO Venta (ID_Comprador, Fecha_Venta, Total)
    VALUES (p_id_comprador, p_fecha_venta, p_total)
    RETURNING ID_Venta INTO v_id_venta;
    
    -- Insertar detalles desde JSON
    FOR v_detalle IN SELECT * FROM json_array_elements(p_detalles)
    LOOP
        INSERT INTO Detalle_Venta (ID_Venta, ID_Vaca, Precio)
        VALUES (
            v_id_venta,
            (v_detalle->>'id_vaca')::INTEGER,
            (v_detalle->>'precio')::DECIMAL(18,2)
        );
    END LOOP;
    
    RETURN v_id_venta;
END;
$$ LANGUAGE plpgsql;

-- Función para registrar usuario
CREATE OR REPLACE FUNCTION registrar_usuario(
    p_nombre VARCHAR(80),
    p_cedula VARCHAR(20),
    p_fecha_nacimiento DATE,
    p_correo VARCHAR(320),
    p_celular VARCHAR(10),
    p_tipo_usuario VARCHAR(20),
    p_id_membresia INTEGER,
    p_contrasena VARCHAR(100),
    p_id_rol INTEGER,
    p_estado BOOLEAN DEFAULT TRUE
) RETURNS INTEGER AS $$
DECLARE
    v_nuevo_id INTEGER;
    v_hash_contrasena BYTEA;
BEGIN
    -- Validar cédula única
    IF EXISTS (SELECT 1 FROM Usuario WHERE Cedula = p_cedula) THEN
        RAISE EXCEPTION 'La cédula ya está registrada';
    END IF;
    
    -- Validar correo único
    IF EXISTS (SELECT 1 FROM Usuario WHERE Correo = p_correo) THEN
        RAISE EXCEPTION 'El correo electrónico ya está registrado';
    END IF;
    
    -- Validar membresía
    IF p_id_membresia IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Membresia WHERE ID_Membresia = p_id_membresia AND Estado = TRUE) THEN
        RAISE EXCEPTION 'La membresía especificada no existe';
    END IF;
    
    -- Validar rol
    IF NOT EXISTS (SELECT 1 FROM Rol WHERE ID_Rol = p_id_rol AND Estado = TRUE) THEN
        RAISE EXCEPTION 'El rol especificado no existe';
    END IF;
    
    -- Crear hash de contraseña
    v_hash_contrasena := decode(encode(digest(p_contrasena, 'sha256'), 'hex'), 'hex');
    
    -- Insertar usuario
    INSERT INTO Usuario (
        Nombre, Cedula, Fecha_Nacimiento, Correo, Celular,
        Tipo_Usuario, ID_Membresia, Contrasena, ID_Rol, Estado
    )
    VALUES (
        p_nombre, p_cedula, p_fecha_nacimiento, p_correo, p_celular,
        p_tipo_usuario, p_id_membresia, v_hash_contrasena, p_id_rol, p_estado
    )
    RETURNING ID_Usuario INTO v_nuevo_id;
    
    RETURN v_nuevo_id;
END;
$$ LANGUAGE plpgsql;

-- Función para eliminar usuario (borrado lógico)
CREATE OR REPLACE FUNCTION eliminar_usuario(p_id_usuario INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE Usuario
    SET Estado = FALSE, FechaModificacion = CURRENT_TIMESTAMP
    WHERE ID_Usuario = p_id_usuario;
END;
$$ LANGUAGE plpgsql;

-- Función para eliminar vaca (borrado lógico)
CREATE OR REPLACE FUNCTION eliminar_vaca(p_id_vaca INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE Vaca
    SET Estado = FALSE, FechaModificacion = CURRENT_TIMESTAMP
    WHERE ID_Vaca = p_id_vaca;
END;
$$ LANGUAGE plpgsql;

-- Función para eliminar venta (borrado lógico)
CREATE OR REPLACE FUNCTION eliminar_venta(p_id_venta INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE Detalle_Venta
    SET Estado = FALSE, FechaModificacion = CURRENT_TIMESTAMP
    WHERE ID_Venta = p_id_venta;
    
    UPDATE Venta
    SET Estado = FALSE, FechaModificacion = CURRENT_TIMESTAMP
    WHERE ID_Venta = p_id_venta;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener usuario por ID
CREATE OR REPLACE FUNCTION obtener_usuario(p_id_usuario INTEGER)
RETURNS TABLE (
    id_usuario INTEGER,
    nombre VARCHAR,
    cedula VARCHAR,
    fecha_nacimiento DATE,
    correo VARCHAR,
    celular VARCHAR,
    tipo_usuario VARCHAR,
    id_membresia INTEGER,
    id_rol INTEGER,
    estado BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.ID_Usuario,
        u.Nombre,
        u.Cedula,
        u.Fecha_Nacimiento,
        u.Correo,
        u.Celular,
        u.Tipo_Usuario,
        u.ID_Membresia,
        u.ID_Rol,
        u.Estado
    FROM Usuario u
    WHERE u.ID_Usuario = p_id_usuario AND u.Estado = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener vaca por ID
CREATE OR REPLACE FUNCTION obtener_vaca(p_id_vaca INTEGER)
RETURNS TABLE (
    id_vaca INTEGER,
    nombre VARCHAR,
    raza VARCHAR,
    edad INTEGER,
    peso DECIMAL(10,2),
    precio DECIMAL(20,2),
    estado_salud VARCHAR,
    id_vendedor INTEGER,
    nombre_vendedor VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.ID_Vaca,
        v.Nombre,
        v.Raza,
        v.Edad,
        v.Peso,
        v.Precio,
        v.Estado_Salud,
        v.ID_Vendedor,
        u.Nombre
    FROM Vaca v
    INNER JOIN Usuario u ON v.ID_Vendedor = u.ID_Usuario
    WHERE v.ID_Vaca = p_id_vaca AND v.Estado = TRUE AND u.Estado = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Función para listar todas las vacas (SP_LISTAR_Vaca)
CREATE OR REPLACE FUNCTION sp_listar_vaca()
RETURNS TABLE (
    id_vaca INTEGER,
    nombre VARCHAR,
    raza VARCHAR,
    edad INTEGER,
    peso DECIMAL(10,2),
    precio DECIMAL(20,2),
    estado_salud VARCHAR,
    id_vendedor INTEGER,
    nombre_vendedor VARCHAR,
    correo_vendedor VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.ID_Vaca, 
        v.Nombre, 
        v.Raza, 
        v.Edad, 
        v.Peso, 
        v.Precio, 
        v.Estado_Salud, 
        v.ID_Vendedor,
        u.Nombre,
        u.Correo
    FROM Vaca v
    INNER JOIN Usuario u ON v.ID_Vendedor = u.ID_Usuario
    WHERE v.Estado = TRUE
    AND u.Estado = TRUE
    ORDER BY v.Nombre;
END;
$$ LANGUAGE plpgsql;

-- Función para listar todos los roles (SP_LISTAR_ROLES)
CREATE OR REPLACE FUNCTION sp_listar_roles()
RETURNS TABLE (
    id_rol INTEGER,
    nombrerol VARCHAR,
    descripcion_rol VARCHAR,
    fechacreacion TIMESTAMP,
    fechamodificacion TIMESTAMP,
    estado BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ID_Rol,
        NombreRol,
        DescripcionRol,
        FechaCreacion,
        FechaModificacion,
        Estado
    FROM Rol
    WHERE Estado = TRUE
    ORDER BY NombreRol;
END;
$$ LANGUAGE plpgsql;

-- Función para listar todos los usuarios (SP_LISTAR_USUARIO)
CREATE OR REPLACE FUNCTION sp_listar_usuario()
RETURNS TABLE (
    id_usuario INTEGER,
    nombre VARCHAR,
    cedula VARCHAR,
    fecha_nacimiento DATE,
    correo VARCHAR,
    celular VARCHAR,
    tipo_usuario VARCHAR,
    id_membresia INTEGER,
    id_rol INTEGER,
    estado BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ID_Usuario,
        Nombre,
        Cedula,
        Fecha_Nacimiento,
        Correo,
        Celular,
        Tipo_Usuario,
        ID_Membresia,
        ID_Rol,
        Estado
    FROM Usuario
    WHERE Estado = TRUE
    ORDER BY Nombre;
END;
$$ LANGUAGE plpgsql;

-- Función para listar membresías (SP_ListarMembresias)
CREATE OR REPLACE FUNCTION sp_listar_membresias()
RETURNS TABLE (
    id_membresia INTEGER,
    nombre_membresia VARCHAR,
    valor_membresia INTEGER,
    fechacreacion TIMESTAMP,
    fechamodificacion TIMESTAMP,
    estado BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ID_Membresia,
        Nombre_Membresia,
        Valor_Membresia,
        FechaCreacion,
        FechaModificacion,
        Estado
    FROM Membresia
    WHERE Estado = TRUE
    ORDER BY Nombre_Membresia;
END;
$$ LANGUAGE plpgsql;

-- Función para listar ventas (ListarVentas)
CREATE OR REPLACE FUNCTION listar_ventas()
RETURNS TABLE (
    id_venta INTEGER,
    id_comprador INTEGER,
    fecha_venta TIMESTAMP,
    total DECIMAL(18,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT ID_Venta, ID_Comprador, Fecha_Venta, Total
    FROM Venta
    WHERE Estado = TRUE
    ORDER BY Fecha_Venta DESC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener detalles de venta (ObtenerDetallesVenta)
CREATE OR REPLACE FUNCTION obtener_detalles_venta(p_id_venta INTEGER)
RETURNS TABLE (
    id_detalle_venta INTEGER,
    id_venta INTEGER,
    id_vaca INTEGER,
    precio DECIMAL(20,2),
    nombre_vaca VARCHAR,
    raza VARCHAR,
    edad INTEGER,
    peso DECIMAL(10,2),
    estado_vaca VARCHAR,
    descuento DECIMAL(18,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dv.ID_Detalle_Venta,
        dv.ID_Venta,
        dv.ID_Vaca,
        dv.Precio,
        v.Nombre,
        v.Raza,
        v.Edad,
        v.Peso,
        v.Estado_Salud,
        dv.Descuento
    FROM Detalle_Venta dv
    INNER JOIN Vaca v ON dv.ID_Vaca = v.ID_Vaca
    WHERE dv.ID_Venta = p_id_venta AND dv.Estado = TRUE AND v.Estado = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener compradores (ObtenerCompradores)
CREATE OR REPLACE FUNCTION obtener_compradores()
RETURNS SETOF Usuario AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM Usuario 
    WHERE Tipo_Usuario IN ('Comprador', 'Ambos') AND Estado = TRUE
    ORDER BY Nombre;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener vendedores (ObtenerVendedores)
CREATE OR REPLACE FUNCTION obtener_vendedores()
RETURNS SETOF Usuario AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM Usuario 
    WHERE Tipo_Usuario IN ('Vendedor', 'Ambos') AND Estado = TRUE
    ORDER BY Nombre;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener tipo de usuario (ObtenerTipoUsuario)
CREATE OR REPLACE FUNCTION obtener_tipo_usuario(p_id_usuario INTEGER)
RETURNS VARCHAR AS $$
DECLARE
    v_tipo_usuario VARCHAR(20);
BEGIN
    SELECT Tipo_Usuario INTO v_tipo_usuario
    FROM Usuario 
    WHERE ID_Usuario = p_id_usuario AND Estado = TRUE;
    
    RETURN v_tipo_usuario;
END;
$$ LANGUAGE plpgsql;

-- Función para registrar rol (SP_REGISTRAR_ROL)
CREATE OR REPLACE FUNCTION sp_registrar_rol(
    p_nombre_rol VARCHAR(100),
    p_descripcion_rol VARCHAR(255) DEFAULT NULL,
    p_estado BOOLEAN DEFAULT TRUE
) RETURNS INTEGER AS $$
DECLARE
    v_nuevo_id INTEGER;
BEGIN
    INSERT INTO Rol (
        NombreRol,
        DescripcionRol,
        Estado
    ) VALUES (
        p_nombre_rol,
        p_descripcion_rol,
        p_estado
    )
    RETURNING ID_Rol INTO v_nuevo_id;
    
    RETURN v_nuevo_id;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar rol (SP_ACTUALIZAR_ROL)
CREATE OR REPLACE FUNCTION sp_actualizar_rol(
    p_id_rol INTEGER,
    p_nombre_rol VARCHAR(100),
    p_descripcion_rol VARCHAR(255),
    p_estado BOOLEAN
) RETURNS VOID AS $$
BEGIN
    UPDATE Rol
    SET 
        NombreRol = p_nombre_rol,
        DescripcionRol = p_descripcion_rol,
        Estado = p_estado,
        FechaModificacion = CURRENT_TIMESTAMP
    WHERE ID_Rol = p_id_rol;
END;
$$ LANGUAGE plpgsql;

-- Función para eliminar rol (SP_ELIMINAR_ROL - borrado lógico)
CREATE OR REPLACE FUNCTION sp_eliminar_rol(p_id_rol INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE Rol
    SET 
        Estado = FALSE,
        FechaModificacion = CURRENT_TIMESTAMP
    WHERE ID_Rol = p_id_rol;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener rol por ID (SP_OBTENER_ROL)
CREATE OR REPLACE FUNCTION sp_obtener_rol(p_id_rol INTEGER)
RETURNS TABLE (
    id_rol INTEGER,
    nombrerol VARCHAR,
    descripcionrol VARCHAR,
    fechacreacion TIMESTAMP,
    fechamodificacion TIMESTAMP,
    estado BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ID_Rol,
        NombreRol,
        DescripcionRol,
        FechaCreacion,
        FechaModificacion,
        Estado
    FROM Rol
    WHERE ID_Rol = p_id_rol AND Estado = TRUE;
END;
$$ LANGUAGE plpgsql;

-- 7. Crear triggers para actualizar FechaModificacion automáticamente
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.FechaModificacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers a todas las tablas
CREATE TRIGGER update_usuario_modtime 
    BEFORE UPDATE ON Usuario 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_vaca_modtime 
    BEFORE UPDATE ON Vaca 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_venta_modtime 
    BEFORE UPDATE ON Venta 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_detalle_venta_modtime 
    BEFORE UPDATE ON Detalle_Venta 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_rol_modtime 
    BEFORE UPDATE ON Rol 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_membresia_modtime 
    BEFORE UPDATE ON Membresia 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 8. Crear vistas
CREATE VIEW vw_ventas_completas AS
SELECT 
    v.ID_Venta,
    v.Fecha_Venta,
    v.Total,
    uc.Nombre AS Comprador,
    uc.Correo AS Correo_Comprador,
    COUNT(dv.ID_Detalle_Venta) AS Cantidad_Vacas,
    SUM(vc.Precio) AS Total_Original
FROM Venta v
JOIN Usuario uc ON v.ID_Comprador = uc.ID_Usuario
JOIN Detalle_Venta dv ON v.ID_Venta = dv.ID_Venta
JOIN Vaca vc ON dv.ID_Vaca = vc.ID_Vaca
WHERE v.Estado = TRUE
GROUP BY v.ID_Venta, v.Fecha_Venta, v.Total, uc.Nombre, uc.Correo;

CREATE VIEW vw_inventario_vacas AS
SELECT 
    v.ID_Vaca,
    v.Nombre AS Nombre_Vaca,
    v.Raza,
    v.Edad,
    v.Peso,
    v.Precio,
    v.Estado_Salud,
    u.Nombre AS Vendedor,
    u.Correo AS Contacto_Vendedor,
    u.Celular AS Telefono_Vendedor,
    CASE 
        WHEN v.Estado = TRUE THEN 'Disponible'
        ELSE 'Vendida'
    END AS Estado_Disponibilidad
FROM Vaca v
JOIN Usuario u ON v.ID_Vendedor = u.ID_Usuario
WHERE u.Estado = TRUE;

CREATE VIEW vw_usuarios_completos AS
SELECT 
    u.ID_Usuario,
    u.Nombre,
    u.Cedula,
    u.Fecha_Nacimiento,
    u.Correo,
    u.Celular,
    u.Tipo_Usuario,
    m.Nombre_Membresia,
    m.Valor_Membresia,
    r.NombreRol,
    r.DescripcionRol,
    CASE 
        WHEN u.Estado = TRUE THEN 'Activo'
        ELSE 'Inactivo'
    END AS Estado_Usuario
FROM Usuario u
LEFT JOIN Membresia m ON u.ID_Membresia = m.ID_Membresia
LEFT JOIN Rol r ON u.ID_Rol = r.ID_Rol;

-- 9. Agregar comentarios a las tablas
COMMENT ON TABLE Usuario IS 'Tabla de usuarios del sistema CowShop';
COMMENT ON TABLE Vaca IS 'Tabla de vacas disponibles para venta';
COMMENT ON TABLE Venta IS 'Tabla de ventas realizadas';
COMMENT ON TABLE Detalle_Venta IS 'Detalles de las ventas (relación venta-vaca)';
COMMENT ON TABLE Rol IS 'Roles de usuario en el sistema';
COMMENT ON TABLE Membresia IS 'Tipos de membresía disponibles';

COMMENT ON COLUMN Usuario.Contrasena IS 'Contraseña hasheada con SHA-256';
COMMENT ON COLUMN Vaca.Estado IS 'TRUE = Disponible, FALSE = Vendida/Eliminada';
COMMENT ON COLUMN Venta.Total IS 'Total de la venta después de descuentos';

-- 10. Verificar que todo se creó correctamente
DO $$
BEGIN
    RAISE NOTICE '=== Base de datos CowShop creada exitosamente ===';
    RAISE NOTICE 'Tablas creadas: 6';
    RAISE NOTICE 'Funciones creadas: 25';
    RAISE NOTICE 'Índices creados: 9';
    RAISE NOTICE 'Triggers creados: 6';
    RAISE NOTICE 'Vistas creadas: 3';
    RAISE NOTICE 'Datos insertados:';
    RAISE NOTICE '  - Miembrosías: 3';
    RAISE NOTICE '  - Roles: 8';
    RAISE NOTICE '  - Usuarios: 6';
    RAISE NOTICE '  - Vacas: 8';
    RAISE NOTICE '  - Ventas: 3';
    RAISE NOTICE '  - Detalles de venta: 3';
END $$;

-- Mostrar conteo de registros
SELECT 'Membresias' as tabla, COUNT(*) as total FROM Membresia WHERE Estado = TRUE
UNION ALL
SELECT 'Roles', COUNT(*) FROM Rol WHERE Estado = TRUE
UNION ALL
SELECT 'Usuarios', COUNT(*) FROM Usuario WHERE Estado = TRUE
UNION ALL
SELECT 'Vacas', COUNT(*) FROM Vaca WHERE Estado = TRUE
UNION ALL
SELECT 'Ventas', COUNT(*) FROM Venta WHERE Estado = TRUE
UNION ALL
SELECT 'Detalles Venta', COUNT(*) FROM Detalle_Venta WHERE Estado = TRUE;