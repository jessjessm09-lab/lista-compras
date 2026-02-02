# 🛒 Lista de Compras - PWA con Supabase

Una aplicación web progresiva (PWA) para gestionar tus listas de compras con autenticación de usuarios y sincronización en tiempo real usando Supabase.

## ✨ Nuevas Características v2.0

- 🔐 **Login y Registro** - Sistema de autenticación con Supabase
- 💰 **Listas con Precios** - Dos tipos de listas: normales y con control de gastos
- 🔄 **Sincronización en Tiempo Real** - Comparte listas con otras personas
- 💾 **Base de Datos en la Nube** - Tus datos se guardan en Supabase
- 📱 **Multi-dispositivo** - Accede desde cualquier dispositivo con tu cuenta

## 🚀 Configuración de Supabase (IMPORTANTE)

### Paso 1: Ejecutar el Script SQL

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard
2. En el menú lateral, haz clic en **"SQL Editor"**
3. Haz clic en **"New query"**
4. Copia TODO el contenido del archivo **`supabase-setup.sql`**
5. Pégalo en el editor
6. Haz clic en **"Run"** (botón verde abajo a la derecha)
7. Deberías ver el mensaje: "Success. No rows returned"

Esto creará:
- Tabla `lists` (listas de compras)
- Tabla `items` (items de las listas)
- Políticas de seguridad (RLS)
- Índices para mejor rendimiento

### Paso 2: Verificar las Tablas

1. En Supabase, ve a **"Table Editor"** en el menú lateral
2. Deberías ver dos tablas nuevas:
   - `lists`
   - `items`

### Paso 3: Configurar Autenticación de Email

1. En Supabase, ve a **"Authentication"** → **"Providers"**
2. Asegúrate que **"Email"** esté habilitado
3. En **"Email Templates"**, puedes personalizar los emails de confirmación (opcional)

## 📦 Archivos del Proyecto

- **index.html**: Interfaz con login y pantalla principal
- **app.js**: Lógica de la app + integración con Supabase
- **styles.css**: Estilos del tema oscuro
- **manifest.json**: Configuración de la PWA
- **sw.js**: Service Worker para funcionamiento offline
- **supabase-setup.sql**: Script SQL para crear las tablas
- **icon-192.png** y **icon-512.png**: Iconos de la app

## 🎯 Cómo Usar la App

### Registro e Inicio de Sesión

1. Abre la app en tu navegador
2. Si es tu primera vez:
   - Haz clic en "¿No tienes cuenta? Regístrate"
   - Ingresa tu email y contraseña (mínimo 6 caracteres)
   - Haz clic en "Registrarse"
   - **Importante**: Revisa tu email para confirmar tu cuenta (check spam)
3. Para iniciar sesión:
   - Ingresa tu email y contraseña
   - Haz clic en "Iniciar Sesión"

### Crear Listas

1. Escribe el nombre de tu lista (ej: "Supermercado")
2. Selecciona el tipo:
   - **Lista Normal**: Para marcar items sin precio
   - **Lista con Precios 💰**: Para controlar gastos
3. Haz clic en "Crear Lista"

### Usar Listas Normales

- Escribe un item y presiona Enter o +
- Marca el checkbox cuando compres el item
- Edita con el lápiz ✏️
- Elimina con la basura 🗑️

### Usar Listas con Precios

- Escribe el nombre del producto (ej: "Arroz")
- Ingresa el precio (ej: 1200)
- Presiona Enter o +
- **El total se calcula automáticamente** al final de la lista

### Compartir Listas

Para compartir una lista con otra persona:
1. La otra persona debe crear una cuenta en la app
2. Necesitarías implementar una función de "compartir" (próxima versión)
3. Actualmente cada usuario ve solo sus propias listas

## 🔄 Actualizar en GitHub Pages

1. Sube los archivos nuevos a tu repositorio
2. Asegúrate de incluir TODOS estos archivos:
   - index.html
   - app.js
   - styles.css
   - manifest.json
   - sw.js
   - icon-192.png
   - icon-512.png
3. GitHub Pages actualizará automáticamente en 2-3 minutos

## 🔐 Seguridad

- ✅ Las contraseñas están encriptadas por Supabase
- ✅ Row Level Security (RLS) activado
- ✅ Cada usuario solo puede ver sus propias listas
- ✅ Las claves de API están protegidas

## 📱 Instalar como App

### Android (Chrome):
1. Abre la URL en Chrome
2. Toca los 3 puntos → "Agregar a pantalla de inicio"
3. Confirma

### iOS (Safari):
1. Abre la URL en Safari
2. Toca el botón compartir
3. "Añadir a pantalla de inicio"

## 🐛 Solución de Problemas

### Error al iniciar sesión
- Verifica que ejecutaste el script SQL en Supabase
- Confirma tu email si es registro nuevo
- Revisa la consola del navegador (F12) para ver errores

### Las listas no se sincronizan
- Verifica que las políticas de RLS estén creadas
- Comprueba tu conexión a internet
- Refresca la página

### Error "relation does not exist"
- No ejecutaste el script SQL
- Ve al SQL Editor de Supabase y ejecuta `supabase-setup.sql`

## 💡 Próximas Funciones

- [ ] Compartir listas con otros usuarios
- [ ] Notificaciones push
- [ ] Modo offline completo
- [ ] Categorías de productos
- [ ] Historial de compras
- [ ] Exportar listas a PDF

## 📝 Licencia

Código abierto - Úsalo y modifícalo libremente

---

**¿Necesitas ayuda?** Abre un issue en GitHub o contacta al desarrollador.

¡Disfruta tu lista de compras inteligente! 🎉
