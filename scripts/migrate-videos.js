#!/usr/bin/env node

/**
 * 🎥 Script de Migración de Videos a Lovable Cloud Storage
 * 
 * Este script sube automáticamente todos los videos desde public/videos/
 * al bucket 'videos' en Supabase Storage.
 * 
 * Uso: node scripts/migrate-videos.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  step: (msg) => console.log(`\n${colors.cyan}${colors.bright}${msg}${colors.reset}`),
};

// Configuración
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const BUCKET_NAME = 'videos';
const VIDEOS_DIR = path.join(__dirname, '..', 'public', 'videos');

// Validar variables de entorno
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  log.error('Faltan variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY');
  log.warning('Asegurate de que el archivo .env existe y tiene las credenciales correctas');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Obtiene todos los archivos .mp4 de la carpeta de videos
 */
function getVideoFiles() {
  try {
    const files = fs.readdirSync(VIDEOS_DIR);
    return files.filter(file => file.endsWith('.mp4'));
  } catch (error) {
    log.error(`Error al leer la carpeta ${VIDEOS_DIR}: ${error.message}`);
    return [];
  }
}

/**
 * Obtiene el tamaño de un archivo en MB
 */
function getFileSizeMB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / (1024 * 1024)).toFixed(2);
}

/**
 * Sube un video al bucket de Supabase Storage
 */
async function uploadVideo(fileName) {
  const filePath = path.join(VIDEOS_DIR, fileName);
  
  try {
    // Leer el archivo
    const fileBuffer = fs.readFileSync(filePath);
    const fileSize = getFileSizeMB(filePath);
    
    log.info(`Subiendo ${fileName} (${fileSize} MB)...`);
    
    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType: 'video/mp4',
        cacheControl: '3600',
        upsert: true, // Reemplaza si ya existe
      });
    
    if (error) {
      throw error;
    }
    
    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);
    
    log.success(`${fileName} subido correctamente`);
    log.info(`URL: ${publicUrlData.publicUrl}`);
    
    return { success: true, fileName, url: publicUrlData.publicUrl };
    
  } catch (error) {
    log.error(`Error al subir ${fileName}: ${error.message}`);
    return { success: false, fileName, error: error.message };
  }
}

/**
 * Verifica que el bucket existe
 */
async function verifyBucket() {
  try {
    const { data, error } = await supabase.storage.getBucket(BUCKET_NAME);
    
    if (error) {
      log.error(`El bucket '${BUCKET_NAME}' no existe o no es accesible`);
      log.warning('Creá el bucket desde Cloud → Storage antes de ejecutar este script');
      return false;
    }
    
    log.success(`Bucket '${BUCKET_NAME}' encontrado`);
    return true;
    
  } catch (error) {
    log.error(`Error al verificar bucket: ${error.message}`);
    return false;
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('\n' + '='.repeat(60));
  log.step('🎥 MIGRACIÓN DE VIDEOS A LOVABLE CLOUD STORAGE');
  console.log('='.repeat(60));
  
  // Paso 1: Verificar bucket
  log.step('📦 Paso 1: Verificando bucket...');
  const bucketExists = await verifyBucket();
  if (!bucketExists) {
    process.exit(1);
  }
  
  // Paso 2: Obtener archivos
  log.step('📁 Paso 2: Detectando archivos de video...');
  const videoFiles = getVideoFiles();
  
  if (videoFiles.length === 0) {
    log.warning('No se encontraron archivos .mp4 en public/videos/');
    process.exit(0);
  }
  
  log.info(`Encontrados ${videoFiles.length} videos:`);
  videoFiles.forEach(file => {
    const sizeMB = getFileSizeMB(path.join(VIDEOS_DIR, file));
    console.log(`  - ${file} (${sizeMB} MB)`);
  });
  
  // Paso 3: Subir archivos
  log.step('☁️  Paso 3: Subiendo videos a Cloud Storage...');
  const results = [];
  
  for (const file of videoFiles) {
    const result = await uploadVideo(file);
    results.push(result);
    
    // Pequeña pausa entre subidas para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Paso 4: Resumen
  log.step('📊 Resumen de migración:');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\n${colors.green}✓ Exitosos: ${successful.length}${colors.reset}`);
  successful.forEach(r => {
    console.log(`  - ${r.fileName}`);
  });
  
  if (failed.length > 0) {
    console.log(`\n${colors.red}✗ Fallidos: ${failed.length}${colors.reset}`);
    failed.forEach(r => {
      console.log(`  - ${r.fileName}: ${r.error}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (failed.length === 0) {
    log.success('¡Migración completada exitosamente! 🎉');
    log.info('Ahora podés eliminar los archivos de public/videos/ si todo funciona');
    log.warning('Verificá primero que los videos se reproduzcan correctamente en /panic y /meditation');
  } else {
    log.warning('Migración completada con errores. Revisá los archivos fallidos.');
  }
  
  console.log('='.repeat(60) + '\n');
}

// Ejecutar
main().catch(error => {
  log.error(`Error fatal: ${error.message}`);
  process.exit(1);
});
