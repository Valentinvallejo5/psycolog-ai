import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'videos';
const VIDEOS_DIR = join(__dirname, '../public/videos');

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function ensureBucketExists() {
  console.log('🔍 Verificando que el bucket "videos" existe...');
  
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('❌ Error al listar buckets:', error.message);
    return false;
  }

  const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
  
  if (bucketExists) {
    console.log('✅ El bucket "videos" ya existe');
    return true;
  }

  console.log('⚠️  El bucket "videos" no existe. Créalo desde el panel de Lovable Cloud antes de continuar.');
  return false;
}

async function getVideoFiles() {
  console.log('📁 Buscando archivos de video en public/videos/...');
  
  try {
    const files = await readdir(VIDEOS_DIR);
    const videoFiles = files.filter(file => extname(file).toLowerCase() === '.mp4');
    
    console.log(`✅ Encontrados ${videoFiles.length} archivos .mp4`);
    return videoFiles;
  } catch (error) {
    console.error('❌ Error al leer el directorio:', error.message);
    return [];
  }
}

async function uploadVideo(filename) {
  const filePath = join(VIDEOS_DIR, filename);
  
  try {
    console.log(`📤 Subiendo: ${filename}...`);
    
    // Read file
    const fileBuffer = await readFile(filePath);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, fileBuffer, {
        contentType: 'video/mp4',
        upsert: true // Sobrescribe si ya existe
      });

    if (error) {
      console.error(`❌ Error al subir ${filename}:`, error.message);
      return { success: false, filename, error: error.message };
    }

    const publicURL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${filename}`;
    console.log(`✅ Subido exitosamente: ${filename}`);
    console.log(`   URL: ${publicURL}`);
    
    return { success: true, filename, url: publicURL };
  } catch (error) {
    console.error(`❌ Error al procesar ${filename}:`, error.message);
    return { success: false, filename, error: error.message };
  }
}

async function migrateVideos() {
  console.log('🚀 Iniciando migración de videos a Lovable Cloud Storage\n');

  // Verify environment variables
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Error: Faltan variables de entorno requeridas');
    console.error('   Asegúrate de tener VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en tu .env');
    process.exit(1);
  }

  // Check bucket exists
  const bucketExists = await ensureBucketExists();
  if (!bucketExists) {
    console.error('\n❌ Abortando migración. Crea el bucket primero.');
    process.exit(1);
  }

  // Get video files
  const videoFiles = await getVideoFiles();
  if (videoFiles.length === 0) {
    console.log('\n⚠️  No se encontraron archivos .mp4 para migrar');
    process.exit(0);
  }

  console.log(`\n📦 Iniciando subida de ${videoFiles.length} archivos...\n`);

  // Upload all videos
  const results = [];
  for (const filename of videoFiles) {
    const result = await uploadVideo(filename);
    results.push(result);
    console.log(''); // Línea en blanco entre archivos
  }

  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 RESUMEN DE MIGRACIÓN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Exitosos: ${successful}`);
  console.log(`❌ Fallidos: ${failed}`);
  console.log(`📁 Total: ${videoFiles.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (successful > 0) {
    console.log('🎉 URLs de los videos subidos:\n');
    results
      .filter(r => r.success)
      .forEach(r => console.log(`   ${r.filename}: ${r.url}`));
  }

  if (failed > 0) {
    console.log('\n⚠️  Archivos con errores:\n');
    results
      .filter(r => !r.success)
      .forEach(r => console.log(`   ${r.filename}: ${r.error}`));
  }
}

// Run migration
migrateVideos().catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});
