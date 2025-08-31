#!/usr/bin/env node

/**
 * Build script for VinaKey Chrome Extension
 * Bundles TypeScript engine with extension files
 */

import fs from 'fs/promises';
import path from 'path';
import { build } from 'esbuild';

const ROOT_DIR = process.cwd();
const EXTENSION_DIR = path.join(ROOT_DIR, 'extension');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'extension-dist');

async function cleanDist() {
  try {
    await fs.rm(DIST_DIR, { recursive: true, force: true });
    console.log('✓ Cleaned extension-dist directory');
  } catch (error) {
    console.log('ℹ No existing extension-dist directory to clean');
  }
  
  await fs.mkdir(DIST_DIR, { recursive: true });
}

async function copyStaticFiles() {
  const staticFiles = [
    'manifest.json',
    'popup/popup.html',
    'popup/popup.css',
    'background/service-worker.js'
  ];
  
  for (const file of staticFiles) {
    const srcPath = path.join(EXTENSION_DIR, file);
    const distPath = path.join(DIST_DIR, file);
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(distPath), { recursive: true });
    
    // Copy file
    await fs.copyFile(srcPath, distPath);
    console.log(`✓ Copied ${file}`);
  }
}

async function buildContentScript() {
  // Bundle the content script with the Vietnamese input engine
  await build({
    entryPoints: [path.join(EXTENSION_DIR, 'content/content-script.js')],
    bundle: true,
    outfile: path.join(DIST_DIR, 'content/content-script.js'),
    format: 'iife',
    target: 'es2020',
    minify: false, // Keep readable for debugging
    sourcemap: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    external: ['chrome']
  });
  
  console.log('✓ Built content script bundle');
}

async function buildPopupScript() {
  // Bundle popup script
  await build({
    entryPoints: [path.join(EXTENSION_DIR, 'popup/popup.js')],
    bundle: true,
    outfile: path.join(DIST_DIR, 'popup/popup.js'),
    format: 'iife',
    target: 'es2020',
    minify: false,
    sourcemap: true,
    external: ['chrome']
  });
  
  console.log('✓ Built popup script bundle');
}

async function buildVietnameseEngine() {
  // Build standalone engine files for web accessible resources
  const engineFiles = [
    'engine/maps/vietnamese-chars.ts',
    'engine/methods/telex.ts'
  ];
  
  for (const file of engineFiles) {
    const inputPath = path.join(SRC_DIR, file);
    const outputPath = path.join(DIST_DIR, file.replace('.ts', '.js'));
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    await build({
      entryPoints: [inputPath],
      outfile: outputPath,
      format: 'esm',
      target: 'es2020',
      minify: false,
      sourcemap: true
    });
  }
  
  console.log('✓ Built Vietnamese engine modules');
}

async function createIconsPlaceholder() {
  // Create icons directory with placeholder files
  const iconsDir = path.join(DIST_DIR, 'icons');
  await fs.mkdir(iconsDir, { recursive: true });
  
  // For now, create placeholder icon files
  // In a real project, you'd copy actual icon files
  const iconSizes = [16, 32, 48, 128];
  for (const size of iconSizes) {
    const iconPath = path.join(iconsDir, `icon-${size}.png`);
    // Create a minimal PNG placeholder (this is just for structure)
    await fs.writeFile(iconPath, Buffer.from('PNG_PLACEHOLDER'), 'utf8');
  }
  
  console.log('✓ Created icon placeholders');
}

async function updateManifest() {
  // Read and update manifest.json with correct paths
  const manifestPath = path.join(DIST_DIR, 'manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  
  // Ensure all paths are correct for the built extension
  manifest.content_scripts[0].js = ['content/content-script.js'];
  
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✓ Updated manifest.json');
}

async function buildExtension() {
  console.log('🚀 Building VinaKey Chrome Extension...\n');
  
  try {
    await cleanDist();
    await copyStaticFiles();
    await buildVietnameseEngine();
    await buildContentScript();
    await buildPopupScript();
    await createIconsPlaceholder();
    await updateManifest();
    
    console.log('\n✅ Extension build completed successfully!');
    console.log(`📁 Extension files are in: ${DIST_DIR}`);
    console.log('💡 Load the extension from Chrome Extensions (Developer Mode)');
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run build if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildExtension();
}

export { buildExtension };