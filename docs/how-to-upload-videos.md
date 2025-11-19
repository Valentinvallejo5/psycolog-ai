# 📦 Cómo subir videos a Lovable Cloud Storage

Este documento explica cómo migrar manualmente los videos desde `public/videos/` a Lovable Cloud Storage.

## ¿Por qué migrar a Cloud Storage?

- Los videos en `public/` hacen lentos los deploys
- No escalan bien para archivos grandes (+2GB)
- Cloud Storage ofrece CDN y mejor performance
- Reduce el tamaño del repositorio

## Pasos para subir videos manualmente

### 1. Acceder a Lovable Cloud

1. Abrí tu proyecto en Lovable
2. Hacé click en el botón **"Cloud"** en la parte superior
3. En el menú lateral, seleccioná **"Storage"**

### 2. Verificar que existe el bucket `videos`

- Deberías ver un bucket llamado **`videos`** (fue creado automáticamente por migración SQL)
- Si no existe, crealo con estas configuraciones:
  - **Name**: `videos`
  - **Public**: ✅ Habilitado (para que los videos sean accesibles públicamente)

### 3. Subir los archivos

Los videos que necesitás subir son:

#### Videos de Panic Help
- `ansiedadEN.mp4` (versión inglés)
- `ansiedadESP1.mp4` (versión español)

#### Videos de Meditación
- `meditacionEN1.mp4` (versión inglés opción 1)
- `meditacionEN2.mp4` (versión inglés opción 2)
- `meditacionES1.mp4` (versión español opción 1)
- `meditacionESP2.mp4` (versión español opción 2)

**Proceso de subida:**
1. Click en el bucket `videos`
2. Click en **"Upload file"** o arrastrá los archivos
3. Subí cada `.mp4` (puede demorar si son grandes, especialmente los de meditación)
4. Esperá a que termine la subida (verás una barra de progreso)

### 4. Verificar las URLs

Una vez subidos, los videos estarán disponibles en:

```
https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/[nombre-archivo].mp4
```

Por ejemplo:
- `https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/ansiedadEN.mp4`
- `https://mncrcotezjyftmrsvzor.supabase.co/storage/v1/object/public/videos/meditacionES1.mp4`

### 5. Probar que funcionan

1. Copiá una URL completa
2. Pegala en una nueva pestaña del navegador
3. El video debería empezar a descargarse o reproducirse
4. Si ves un error 404, verificá:
   - Que el bucket sea **público**
   - Que el nombre del archivo esté bien escrito (respetando mayúsculas/minúsculas)

### 6. Limpiar archivos locales (opcional)

Una vez que **todos** los videos estén funcionando desde Cloud Storage:

```bash
# Eliminá los videos locales para reducir el tamaño del repo
rm -rf public/videos/*.mp4
```

⚠️ **No elimines la carpeta** `public/videos/` ni el archivo `.gitkeep` por si necesitás agregar videos temporales en el futuro.

## Troubleshooting

### Error: "Video no carga en el reproductor"

- Verificá que el bucket `videos` sea **público**
- Revisá las políticas RLS en Cloud → Storage → Policies
- Debe existir una policy "Videos are publicly accessible"

### Error: "No puedo subir archivos"

- Asegurate de estar autenticado en Lovable Cloud
- Verificá que tengas permisos de administrador en el proyecto
- Si el archivo es muy grande (+2GB), puede tardar varios minutos

### El video se sube pero muestra 404

- Verificá el nombre exacto del archivo (case-sensitive)
- Asegurate de que esté en el bucket `videos` (no en subcarpetas)
- Probá acceder directamente a la URL en el navegador

## Configuración actual del código

El archivo `src/config/guidedVideos.ts` ya está configurado para usar Cloud Storage:

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

✅ Una vez subidos los videos, la app funcionará automáticamente sin cambios de código.

---

**Documentación oficial**: [Lovable Cloud Storage](https://docs.lovable.dev/features/cloud#storage)
