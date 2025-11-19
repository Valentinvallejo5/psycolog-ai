# 🚀 Manual: Ejecutar Migración Automática de Videos

Este documento explica cómo usar el script automático para migrar todos los videos desde `public/videos/` a Lovable Cloud Storage.

---

## ✅ Pre-requisitos

Antes de ejecutar el script, asegurate de tener:

- [x] **Node.js** instalado (versión 16 o superior)
- [x] **Bucket `videos`** creado en Cloud → Storage (público)
- [x] Archivo **`.env`** con las credenciales de Supabase
- [x] Videos en la carpeta **`public/videos/`**

---

## 📋 Paso a Paso

### 1. Verificar que el bucket existe

1. Abrí Lovable → **Cloud** → **Storage**
2. Verificá que existe un bucket llamado **`videos`**
3. Asegurate de que sea **público** (ícono de candado abierto)

Si no existe, crealo:
- Click en **"Create bucket"**
- Nombre: `videos`
- Público: ✅ Habilitado
- Click en **"Create"**

---

### 2. Abrir la terminal en el proyecto

Abrí una terminal en la raíz de tu proyecto (donde está `package.json`).

**En VS Code:**
```bash
Terminal → New Terminal
```

**En tu sistema:**
```bash
cd ruta/a/tu/proyecto
```

---

### 3. Ejecutar el script de migración

Ejecutá el siguiente comando:

```bash
node scripts/migrate-videos.js
```

**Salida esperada:**

```
============================================================
🎥 MIGRACIÓN DE VIDEOS A LOVABLE CLOUD STORAGE
============================================================

📦 Paso 1: Verificando bucket...
✓ Bucket 'videos' encontrado

📁 Paso 2: Detectando archivos de video...
ℹ Encontrados 6 videos:
  - ansiedadEN.mp4 (45.23 MB)
  - ansiedadESP1.mp4 (48.12 MB)
  - meditacionEN1.mp4 (52.34 MB)
  - meditacionEN2.mp4 (50.89 MB)
  - meditacionES1.mp4 (51.67 MB)
  - meditacionESP2.mp4 (49.45 MB)

☁️  Paso 3: Subiendo videos a Cloud Storage...
ℹ Subiendo ansiedadEN.mp4 (45.23 MB)...
✓ ansiedadEN.mp4 subido correctamente
ℹ URL: https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/ansiedadEN.mp4
...

📊 Resumen de migración:

✓ Exitosos: 6
  - ansiedadEN.mp4
  - ansiedadESP1.mp4
  - meditacionEN1.mp4
  - meditacionEN2.mp4
  - meditacionES1.mp4
  - meditacionESP2.mp4

============================================================
✓ ¡Migración completada exitosamente! 🎉
ℹ Ahora podés eliminar los archivos de public/videos/ si todo funciona
⚠ Verificá primero que los videos se reproduzcan correctamente en /panic y /meditation
============================================================
```

---

## 🧪 Verificar que Funcionó

### 1. Verificar en Cloud Storage

1. Abrí **Cloud → Storage → videos**
2. Deberías ver los 6 archivos subidos
3. Click derecho en uno → **"Copy URL"**
4. Pegá la URL en el navegador → debería cargar el video

### 2. Probar en la App

1. Navegá a `/panic` en tu app
2. Intentá reproducir el video en inglés y español
3. Navegá a `/meditation`
4. Intentá reproducir los videos en ambos idiomas
5. Verificá que:
   - Se carguen sin errores
   - Los controles funcionen
   - El fullscreen funcione

---

## 🗑️ Limpiar Archivos Locales (Opcional)

**⚠️ SOLO DESPUÉS DE VERIFICAR QUE TODO FUNCIONA**

Una vez que confirmaste que todos los videos se reproducen correctamente desde Cloud Storage:

```bash
# Eliminar videos locales
rm public/videos/*.mp4

# O manualmente, uno por uno:
rm public/videos/ansiedadEN.mp4
rm public/videos/ansiedadESP1.mp4
rm public/videos/meditacionEN1.mp4
rm public/videos/meditacionEN2.mp4
rm public/videos/meditacionES1.mp4
rm public/videos/meditacionESP2.mp4
```

✅ **Mantené** el archivo `public/videos/.gitkeep`

---

## 🐛 Solución de Problemas

### Error: "Faltan variables de entorno"

**Problema:**
```
✗ Faltan variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY
```

**Solución:**
1. Verificá que existe el archivo `.env` en la raíz del proyecto
2. Asegurate de que tiene estas líneas:
   ```env
   VITE_SUPABASE_URL=https://mncrcotezjyftmrsvzor.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

### Error: "El bucket 'videos' no existe"

**Problema:**
```
✗ El bucket 'videos' no existe o no es accesible
```

**Solución:**
1. Abrí Cloud → Storage
2. Creá el bucket `videos` (público)
3. Volvé a ejecutar el script

---

### Error: "No se encontraron archivos .mp4"

**Problema:**
```
⚠ No se encontraron archivos .mp4 en public/videos/
```

**Solución:**
1. Verificá que los videos estén en `public/videos/`
2. Asegurate de que tengan extensión `.mp4`
3. Ejecutá desde la raíz del proyecto, no desde `/scripts`

---

### Error al subir un archivo específico

**Problema:**
```
✗ Error al subir meditacionEN1.mp4: Network error
```

**Posibles causas:**
- Archivo demasiado grande (límite de Storage)
- Conexión a internet interrumpida
- Permisos insuficientes en el bucket

**Solución:**
1. Verificá tu conexión a internet
2. Re-ejecutá el script (usa `upsert: true`, así no duplica)
3. Si persiste, subí ese archivo manualmente desde Cloud → Storage

---

### El script se ejecuta pero los videos no aparecen

**Solución:**
1. Refrescá la página de Cloud → Storage
2. Verificá que el bucket sea público
3. Revisá las políticas RLS:
   - Debe existir "Videos are publicly accessible" (SELECT)
   - Debe existir "Authenticated users can upload videos" (INSERT)

---

## 🔄 Re-ejecutar el Script

El script usa `upsert: true`, lo que significa que podés ejecutarlo múltiples veces sin problemas:

- Si un archivo ya existe, se **reemplazará**
- No se crearán duplicados
- Es seguro re-ejecutarlo si falla parcialmente

```bash
# Podés ejecutarlo las veces que quieras
node scripts/migrate-videos.js
```

---

## 📊 Detalles Técnicos

### ¿Qué hace el script?

1. **Verifica credenciales** (`.env`)
2. **Verifica bucket** (`videos` existe y es accesible)
3. **Lee archivos** de `public/videos/*.mp4`
4. **Sube cada video** a Supabase Storage usando el SDK
5. **Genera URLs públicas** para cada video
6. **Muestra resumen** (exitosos/fallidos)

### Configuración del upload

```javascript
{
  contentType: 'video/mp4',
  cacheControl: '3600',  // Cache de 1 hora
  upsert: true,          // Reemplaza si existe
}
```

### Políticas RLS requeridas

El script necesita estas políticas (ya creadas):

```sql
-- Lectura pública
CREATE POLICY "Videos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

-- Escritura autenticada
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');
```

---

## ✅ Checklist Final

Después de ejecutar el script:

- [ ] Todos los videos se subieron exitosamente (0 fallidos)
- [ ] Probé `/panic` en inglés y funciona
- [ ] Probé `/panic` en español y funciona
- [ ] Probé `/meditation` en inglés y funciona
- [ ] Probé `/meditation` en español y funciona
- [ ] Los controles del reproductor funcionan correctamente
- [ ] Eliminé los archivos de `public/videos/*.mp4`
- [ ] Hice commit y push de los cambios

---

## 🎉 ¡Listo!

Si completaste todos los pasos, tu migración fue exitosa. Los videos ahora se sirven desde Lovable Cloud Storage con:

✨ **Deploy más rápido** (repo más liviano)  
🚀 **Mejor performance** (CDN global)  
💾 **Escalabilidad** (almacenamiento ilimitado)  
📊 **Métricas** (estadísticas en Cloud)

---

**¿Dudas?** Consultá `/docs/migracion_videos.md` para más detalles técnicos.
