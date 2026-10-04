# GOLOPY App

Aplicación web de punto de venta (POS) para registrar pedidos, gestionar el catálogo de productos y consultar ventas de GOLOPY.

## Funcionalidades

- **Pedidos y facturas:** selección de productos, cantidades, personalización de ingredientes, cálculo de subtotal, ITBIS y total, registro de la orden e impresión en formato POS de 80 mm.
- **Productos:** listado, búsqueda, filtro por categoría, consulta de detalles, creación y edición. Cada producto tiene estado activo/inactivo y una opción independiente para aplicar ITBIS.
- **Órdenes:** consulta de órdenes y sus productos, con búsqueda por número y filtros de fechas.
- **Informes:** ventas por fecha, resumen de ventas, productos más vendidos y exportación a CSV o JSON.
- **Configuración:** perfil del comercio, datos visibles en la factura, tasa de ITBIS y gestión de usuarios, roles y permisos.
- **Inventario:** la opción de navegación se conserva; actualmente muestra la pantalla informativa existente.
- **Diseño adaptable:** uso en computadora y dispositivos móviles.

## Tecnologías y dependencias

### Requisitos

- Node.js 24 LTS (recomendado) o una versión LTS compatible con `sqlite3`.
- npm, incluido con Node.js.
- Git para clonar el repositorio.
- Conexión a Internet para cargar Tailwind CSS, Font Awesome y las fuentes de Google Fonts incluidas desde CDN.

### Dependencias de Node.js

Las dependencias directas están declaradas en `package.json` y las versiones exactas resueltas están en `package-lock.json`.

| Paquete | Versión fijada en el lockfile | Uso |
| --- | --- | --- |
| `express` | 4.22.3 | Servidor HTTP, páginas y API REST. |
| `sqlite3` | 5.1.7 | Base de datos SQLite local para productos, órdenes, ventas, configuración y usuarios. |

El resto de los paquetes de `package-lock.json` son dependencias transitivas de estos paquetes. La interfaz está hecha con HTML, CSS y JavaScript del navegador; no requiere un compilador ni un paso de *build*.

## Instalación y ejecución

Desde PowerShell, CMD o una terminal:

```powershell
git clone <URL-DEL-REPOSITORIO>
cd GolopyApp
npm ci
npm start
```

También se puede iniciar directamente con:

```powershell
node server.js
```

Al iniciar, el servidor prepara la base de datos y muestra la dirección local. Abre esa dirección en un navegador, normalmente:

```text
http://localhost:3001
```

Si el puerto 3001 ya está ocupado, el servidor intenta los puertos 3002, 3003 y 3004. Para detenerlo, vuelve a la terminal y presiona **Ctrl+C**.

## Pruebas

Con las dependencias instaladas y la base de datos inicializada, ejecuta:

```powershell
node --test tests/sales.test.js
```

Las pruebas comprueban consultas del historial, generación CSV, detalle de órdenes y productos más vendidos. El ejecutor `node:test` viene integrado en Node.js; no se instala como dependencia aparte.

Si la base no tiene todavía las tablas, inicia `npm start` una vez para que el servidor las cree y luego detenlo con **Ctrl+C** antes de ejecutar las pruebas.

## Base de datos y persistencia

La aplicación usa el archivo `golopy.db` ubicado en la carpeta raíz del proyecto. El archivo se incluye en este repositorio como una instantánea de los datos al momento de preparar esta versión. Al iniciar, `ensureDatabase()` crea las tablas que falten y aplica las migraciones necesarias, sin borrar las tablas existentes.

La base guarda, entre otros datos:

- Productos, precios, categorías, ingredientes, estado e indicador de ITBIS.
- Órdenes, números de factura, importes e historial de artículos vendidos.
- Perfil del comercio, configuración de facturas, usuarios, roles y permisos.

Los cambios nuevos se escriben en `golopy.db`. Cada clon de Git tiene su propia copia local: las modificaciones realizadas en una computadora **no se sincronizan automáticamente** con las otras. Para trasladar una copia reciente, detén el servidor y copia `golopy.db` a la carpeta raíz del otro clon. Conserva un respaldo antes de reemplazar una base existente.

La base está incluida por solicitud del proyecto. Si el repositorio es público o se comparte con terceros, ten presente que el archivo puede contener información comercial y de clientes. Para sincronización entre varias computadoras se necesitaría alojar la aplicación y una base de datos compartida en un servidor.

## Páginas y API

Las secciones pueden abrirse directamente por estas rutas:

| Ruta | Sección |
| --- | --- |
| `/` | Pedidos / punto de venta |
| `/ordenes` | Órdenes |
| `/productos` | Productos |
| `/inventario` | Inventario |
| `/informes` | Informes |
| `/configuracion` | Perfil, facturas y usuarios |

La API principal está disponible bajo `/api`:

- `GET /api/health`: estado del servidor.
- `GET /api/menu` y `GET /api/products`: catálogo.
- `POST /api/products`: creación o edición de producto.
- `POST /api/orders`: registro de una orden y sus importes.
- `GET /api/sales` y `GET /api/sales/export`: historial y exportación CSV/JSON.
- `GET /api/orders/detail`: órdenes con detalle.
- `GET /api/products/top-selling`: productos más vendidos.
- `GET /api/settings` y `PUT /api/settings`: configuración.
- `GET /api/users` y `POST /api/users`: gestión de usuarios.

## Notas

- La impresión utiliza el diálogo de impresión del navegador. Selecciona el controlador de la impresora 2Connect y el rollo de 80 mm.
- Los roles y permisos se pueden guardar; el sistema todavía no tiene inicio de sesión para aplicarlos como restricciones de acceso.
- El tipo de cambio de ITBIS configurado se calcula solo para los productos marcados como gravados.
