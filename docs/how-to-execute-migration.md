# 🎬 Tutorial: Cómo migrar videos a Lovable Cloud Storage

Este tutorial te va a guiar paso a paso para subir automáticamente todos tus videos a Lovable Cloud Storage.

---

## 📋 Paso 1: Asegurate de tener el bucket "videos" creado

Antes de ejecutar el script, necesitás crear el bucket donde se van a guardar los videos.

### ¿Cómo crear el bucket?

1. **Abrí tu proyecto en Lovable**
2. **Hacé click en la pestaña "Cloud"** (arriba a la derecha)
3. **Entrá a "Storage"**
4. **Si ya ves un bucket llamado "videos"**, ¡perfecto! Seguí al paso 2.
5. **Si NO existe**, crealo:
   - Click en "Create bucket"
   - Nombre: `videos`
   - Public: **✅ SÍ** (marcá como público)
   - Click en "Create"

---

## 🔑 Paso 2: Conseguí tu "Service Role Key"

Esta es una clave secreta que le permite al script subir archivos sin restricciones.

### ¿Dónde la consigo?

1. Abrí tu proyecto en Lovable
2. Hacé click en el ícono de **⚙️ Settings** (arriba a la derecha)
3. Buscá la sección **"Integrations"** → **"Lovable Cloud"**
4. Hacé click en **"View secrets"** o **"Manage secrets"**
5. Buscá la clave que dice: **`SUPABASE_SERVICE_ROLE_KEY`**
6. Copiá ese valor (es un texto largo que empieza con `eyJ...`)

---

## 📝 Paso 3: Agregá la clave al archivo `.env`

Ahora vas a poner esa clave en un archivo de configuración.

### En tu Mac:

1. **Abrí Finder**
2. **Navegá a la carpeta de tu proyecto** (donde está el código)
3. **Buscá el archivo `.env`** (está en la raíz del proyecto)
   - Si **no lo ves**, presioná **`Cmd + Shift + .`** (punto) para mostrar archivos ocultos
4. **Abrí el archivo `.env`** con TextEdit o cualquier editor de texto
5. **Agregá esta línea al final del archivo**:

```
SUPABASE_SERVICE_ROLE_KEY=eyJ... (pegá acá la clave que copiaste)
```

6. **Guardá el archivo** (Cmd + S)

**Ejemplo de cómo debería quedar tu `.env`:**

```
VITE_SUPABASE_URL=https://mncrcotezjyftmrsvzor.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 💻 Paso 4: Abrí la Terminal

Ahora vamos a ejecutar el script desde la terminal.

### ¿Cómo abrir la Terminal en Mac?

**Opción 1: Spotlight**
1. Presioná **`Cmd + Espacio`**
2. Escribí: **`Terminal`**
3. Presioná **Enter**

**Opción 2: Desde Launchpad**
1. Abrí **Launchpad** (el ícono del cohete en el dock)
2. Buscá la carpeta **"Otros"** o **"Utilidades"**
3. Click en **"Terminal"**

---

## 📂 Paso 5: Navegar a la carpeta de tu proyecto

Una vez que tengas la Terminal abierta, tenés que ir a la carpeta donde está tu proyecto.

### Comandos para moverte:

```bash
# Ver en qué carpeta estás actualmente
pwd

# Ver qué archivos/carpetas hay
ls

# Entrar a una carpeta (reemplazá "nombre-carpeta" por el nombre real)
cd nombre-carpeta

# Volver a la carpeta anterior
cd ..

# Ir directamente a tu carpeta de inicio
cd ~
```

### Ejemplo práctico:

Si tu proyecto está en `Documentos/psicologia/`:

```bash
cd ~/Documents/psicologia
```

**💡 Tip:** Podés arrastrar la carpeta del proyecto desde Finder hasta la Terminal y se pegará la ruta automáticamente.

---

## 🚀 Paso 6: Ejecutar el script de migración

Cuando ya estés dentro de la carpeta del proyecto, ejecutá este comando:

```bash
node scripts/migrate-videos.js
```

### ¿Qué va a pasar?

El script va a:
1. ✅ Verificar que el bucket "videos" existe
2. 📁 Buscar todos los archivos `.mp4` en `public/videos/`
3. 📤 Subir cada video a Lovable Cloud Storage
4. ✅ Mostrar el progreso y las URLs de los videos subidos

### Ejemplo de salida:

```
🚀 Iniciando migración de videos a Lovable Cloud Storage

🔍 Verificando que el bucket "videos" existe...
✅ El bucket "videos" ya existe
📁 Buscando archivos de video en public/videos/...
✅ Encontrados 6 archivos .mp4

📦 Iniciando subida de 6 archivos...

📤 Subiendo: ansiedadEN.mp4...
✅ Subido exitosamente: ansiedadEN.mp4
   URL: https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/ansiedadEN.mp4

📤 Subiendo: meditacionES1.mp4...
✅ Subido exitosamente: meditacionES1.mp4
   URL: https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/meditacionES1.mp4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 RESUMEN DE MIGRACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Exitosos: 6
❌ Fallidos: 0
📁 Total: 6
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 URLs de los videos subidos:

   ansiedadEN.mp4: https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/ansiedadEN.mp4
   ...
```

---

## ❌ Problemas comunes

### Error: "Cannot find module '@supabase/supabase-js'"

**Solución:** Instalá las dependencias primero:

```bash
npm install @supabase/supabase-js
```

### Error: "Faltan variables de entorno requeridas"

**Solución:** Verificá que tu archivo `.env` tenga:
- `VITE_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Error: "El bucket 'videos' no existe"

**Solución:** Volvé al Paso 1 y creá el bucket desde el panel de Lovable Cloud.

### Error: "ENOENT: no such file or directory"

**Solución:** Asegurate de que:
1. Estés en la carpeta correcta del proyecto (verificá con `pwd`)
2. Exista la carpeta `public/videos/` con archivos `.mp4` adentro

---

## ✅ Verificación final

Una vez que el script termine exitosamente:

1. Andá al panel de **Lovable Cloud → Storage → videos**
2. Deberías ver todos tus archivos listados ahí
3. Podés hacer click en cualquier archivo para ver su URL pública

---

## 🎉 ¡Listo!

Ya tenés todos tus videos subidos a Lovable Cloud Storage. Ahora podés usar las URLs generadas en tu aplicación para reemplazar las referencias a `public/videos/`.

**Ejemplo de URL generada:**
```
https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/ansiedadEN.mp4
```

---

## 📞 ¿Necesitás ayuda?

Si tenés algún problema:
1. Leé los mensajes de error con atención
2. Revisá que hayas seguido todos los pasos
3. Verificá que el bucket esté creado y sea público
4. Asegurate de tener las variables de entorno correctas en `.env`
