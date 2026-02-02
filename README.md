# 🛒 Lista de Compras - PWA

Una aplicación web progresiva (PWA) para gestionar tus listas de compras. Funciona online y offline, y se puede instalar como una app en tu dispositivo móvil.

## 📱 Características

- ✅ Crear múltiples listas de compras
- ✅ Agregar, editar y eliminar items
- ✅ Marcar items como completados
- ✅ Funciona sin conexión a internet (offline)
- ✅ Se puede instalar como app en el móvil
- ✅ Guarda automáticamente tus datos
- ✅ Diseño responsivo y moderno

## 🚀 Cómo subir a GitHub

### Paso 1: Crear un repositorio en GitHub

1. Ve a [GitHub.com](https://github.com) e inicia sesión
2. Haz clic en el botón "+" arriba a la derecha y selecciona "New repository"
3. Ponle un nombre (por ejemplo: `lista-compras`)
4. Selecciona "Public" para que GitHub Pages funcione gratis
5. NO marques "Initialize with README" (ya tenemos uno)
6. Haz clic en "Create repository"

### Paso 2: Subir los archivos

Tienes dos opciones:

#### Opción A: Usar la interfaz web de GitHub (más fácil)

1. En tu repositorio recién creado, haz clic en "uploading an existing file"
2. Arrastra todos estos archivos a la vez:
   - `index.html`
   - `manifest.json`
   - `styles.css`
   - `app.js`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`
   - `README.md`
3. Escribe un mensaje (por ejemplo: "Primera versión")
4. Haz clic en "Commit changes"

#### Opción B: Usar Git desde la terminal

```bash
git init
git add .
git commit -m "Primera versión de la app"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/lista-compras.git
git push -u origin main
```

### Paso 3: Activar GitHub Pages

1. En tu repositorio, ve a "Settings" (Configuración)
2. En el menú lateral, haz clic en "Pages"
3. En "Source", selecciona "main" o "master" branch
4. Haz clic en "Save"
5. Espera unos minutos y tu app estará disponible en:
   `https://TU-USUARIO.github.io/lista-compras/`

## 📲 Cómo instalar la app en tu móvil

### En Android (Chrome):
1. Abre la URL de tu app en Chrome
2. Toca el menú (3 puntos) arriba a la derecha
3. Selecciona "Agregar a pantalla de inicio" o "Instalar app"
4. Confirma y listo!

### En iOS (Safari):
1. Abre la URL de tu app en Safari
2. Toca el botón de compartir (cuadrado con flecha)
3. Desplázate y toca "Añadir a pantalla de inicio"
4. Toca "Añadir"

## 🛠️ Archivos del proyecto

- **index.html**: Página principal de la aplicación
- **manifest.json**: Configuración de la PWA
- **styles.css**: Estilos y diseño
- **app.js**: Lógica de la aplicación
- **sw.js**: Service Worker para funcionamiento offline
- **icon-192.png**: Icono pequeño de la app
- **icon-512.png**: Icono grande de la app

## 💾 Almacenamiento

La aplicación usa localStorage para guardar tus datos localmente en tu dispositivo. Esto significa:
- Tus listas se guardan automáticamente
- No se envían a ningún servidor
- Los datos permanecen en tu dispositivo
- Funcionan sin conexión a internet

## 🔧 Personalización

Puedes personalizar:
- Colores en `styles.css`
- Texto en `index.html`
- Funcionalidades en `app.js`
- Información de la app en `manifest.json`

## 📝 Licencia

Este proyecto es de código abierto. Puedes usarlo y modificarlo libremente.

---

¡Disfruta tu lista de compras! 🎉
