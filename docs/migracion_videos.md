# 📹 Migración de Videos a Lovable Cloud Storage

## 📊 Resumen de Archivos Detectados

| Archivo | Ubicación Actual | Uso | URL Cloud Storage |
|---------|------------------|-----|-------------------|
| `ansiedadEN.mp4` | `public/videos/` | Panic Help (EN) | `https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/ansiedadEN.mp4` |
| `ansiedadESP1.mp4` | `public/videos/` | Panic Help (ES) | `https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/ansiedadESP1.mp4` |
| `meditacionEN1.mp4` | `public/videos/` | Meditación (EN) opción 1 | `https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/meditacionEN1.mp4` |
| `meditacionEN2.mp4` | `public/videos/` | Meditación (EN) opción 2 | `https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/meditacionEN2.mp4` |
| `meditacionES1.mp4` | `public/videos/` | Meditación (ES) opción 1 | `https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/meditacionES1.mp4` |
| `meditacionESP2.mp4` | `public/videos/` | Meditación (ES) opción 2 | `https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/meditacionESP2.mp4` |

**Total de archivos:** 6 videos  
**Bucket destino:** `videos` (público, ya creado)

---

## 🚀 Pasos para la Migración Manual

### 1️⃣ Acceder al Storage en Lovable Cloud

1. En tu proyecto de Lovable, hacé click en el botón **"Cloud"** (esquina superior derecha)
2. En el panel lateral izquierdo, seleccioná **"Storage"**
3. Deberías ver el bucket **`videos`** (si no lo ves, crealo con acceso público)

### 2️⃣ Subir los Videos Manualmente

**Orden recomendado (empezá por los más críticos):**

1. **Panic Help:**
   - `ansiedadEN.mp4`
   - `ansiedadESP1.mp4`

2. **Meditación principal:**
   - `meditacionEN1.mp4`
   - `meditacionES1.mp4`

3. **Meditación alternativa:**
   - `meditacionEN2.mp4`
   - `meditacionESP2.mp4`

**Proceso de subida:**
1. Click en el bucket `videos`
2. Arrastrá los archivos desde tu carpeta `public/videos/` local
3. O click en **"Upload"** y seleccioná los archivos
4. Esperá a que termine cada subida (puede demorar varios minutos por video)
5. ✅ Verificá que el archivo aparezca en la lista con el nombre correcto

⚠️ **Importante:** Los nombres de archivo deben ser **exactamente iguales** a los originales (respetá mayúsculas/minúsculas).

### 3️⃣ Verificar que Funcionan

Para cada video subido, verificá que sea accesible:

1. Click derecho sobre el archivo → **"Copy URL"**
2. Pegá la URL en una nueva pestaña del navegador
3. El video debería empezar a cargarse o descargarse
4. Si ves error 404, revisá:
   - Que el bucket `videos` esté configurado como **público**
   - Que el nombre del archivo sea exacto (sin espacios, con extensión `.mp4`)

**URLs esperadas:**
```
https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/ansiedadEN.mp4
https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/ansiedadESP1.mp4
https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/meditacionEN1.mp4
https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/meditacionEN2.mp4
https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/meditacionES1.mp4
https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/meditacionESP2.mp4
```

### 4️⃣ Probar en la App

Una vez subidos todos los videos:

1. Navegá a tu app en `/panic` y `/meditation`
2. Intentá reproducir los videos
3. Verificá que:
   - Se carguen correctamente
   - Los controles funcionen (play, pause, skip)
   - El fullscreen funcione
   - Los subtítulos/idiomas cambien correctamente

### 5️⃣ Limpiar Archivos Locales (SOLO cuando TODO funcione)

⚠️ **NO HAGAS ESTO HASTA QUE CONFIRMES QUE TODO FUNCIONA**

Una vez que **todos los videos** se reproduzcan correctamente desde Cloud Storage:

```bash
# Desde la raíz del proyecto:
rm public/videos/ansiedadEN.mp4
rm public/videos/ansiedadESP1.mp4
rm public/videos/meditacionEN1.mp4
rm public/videos/meditacionEN2.mp4
rm public/videos/meditacionES1.mp4
rm public/videos/meditacionESP2.mp4
```

✅ **MANTENÉ** el archivo `public/videos/.gitkeep` para preservar la estructura de carpetas.

---

## 🔧 Configuración Técnica

### Bucket `videos` - Configuración

- **ID:** `videos`
- **Nombre:** `videos`
- **Acceso:** Público (`public: true`)
- **Políticas RLS:**
  - ✅ Lectura pública habilitada
  - ✅ Escritura solo para usuarios autenticados

### Código Actualizado

El archivo `src/config/guidedVideos.ts` **ya está configurado** para usar las URLs de Cloud Storage:

```typescript
const STORAGE_BASE_URL = "https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos";

export const GUIDED_VIDEOS = {
  panic: {
    en: `${STORAGE_BASE_URL}/ansiedadEN.mp4`,
    es: `${STORAGE_BASE_URL}/ansiedadESP1.mp4`,
  },
  meditation: {
    en: `${STORAGE_BASE_URL}/meditacionEN1.mp4`,
    es: `${STORAGE_BASE_URL}/meditacionES1.mp4`,
  },
} as const;
```

No necesitás cambiar ningún código, solo subir los videos.

---

## 🐛 Troubleshooting

### Problema: Video no carga (error 404)

**Causas comunes:**
- El archivo no se subió correctamente
- El nombre tiene mayúsculas/minúsculas incorrectas
- El bucket no es público

**Solución:**
1. Verificá que el archivo exista en el bucket `videos`
2. Verificá el nombre exacto (case-sensitive)
3. En Cloud → Storage → Settings del bucket, asegurate que sea público

### Problema: Video carga pero no se reproduce

**Causas comunes:**
- Formato de video incompatible con navegadores
- CORS bloqueado
- Video corrupto

**Solución:**
1. Asegurate de que el formato sea `.mp4` (H.264 codec)
2. Verificá las políticas CORS en el bucket
3. Intentá reproducir el archivo localmente para descartar corrupción

### Problema: Lentitud al cargar videos

**Causas comunes:**
- Videos muy pesados sin optimización
- Conexión lenta del usuario
- CDN no habilitado

**Solución:**
1. Considerá comprimir los videos (sin perder calidad)
2. Habilitá CDN en la configuración de Lovable Cloud
3. Implementá loading states en `CustomVideoPlayer`

### Problema: No puedo subir archivos (error de permisos)

**Solución:**
1. Asegurate de estar autenticado en Lovable
2. Verificá que tengas rol de admin en el proyecto
3. Revisá las políticas RLS del bucket `videos`

---

## 📋 Checklist de Migración

- [ ] Accedí a Cloud → Storage
- [ ] Verifiqué que existe el bucket `videos`
- [ ] Subí `ansiedadEN.mp4`
- [ ] Subí `ansiedadESP1.mp4`
- [ ] Subí `meditacionEN1.mp4`
- [ ] Subí `meditacionES1.mp4`
- [ ] Subí `meditacionEN2.mp4`
- [ ] Subí `meditacionESP2.mp4`
- [ ] Probé las URLs en el navegador
- [ ] Probé los videos en `/panic` (EN y ES)
- [ ] Probé los videos en `/meditation` (EN y ES)
- [ ] Todo funciona correctamente
- [ ] Borré los archivos de `public/videos/` (excepto `.gitkeep`)
- [ ] Hice commit y push de los cambios

---

## ✅ Beneficios de Cloud Storage

✨ **Deploy más rápido:** El repositorio pesa mucho menos  
🚀 **CDN global:** Los videos se sirven desde servidores cercanos al usuario  
💾 **Escalable:** No hay límite de almacenamiento  
🔒 **Seguro:** Control de acceso mediante RLS  
📊 **Métricas:** Podés ver estadísticas de uso en Cloud  

---

**Documentación oficial:** [Lovable Cloud Storage](https://docs.lovable.dev/features/cloud#storage)  
**Soporte:** Si tenés problemas, consultá en el Discord de Lovable
