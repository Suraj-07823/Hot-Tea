/*
Simple build script:
- Bundles JS using esbuild (minified)
- Processes CSS with PostCSS (autoprefixer + cssnano)
- Optimizes images (generates WebP + AVIF + resized PNG/SVG copies) using sharp
- Copies HTML files and rewrites references to built assets
- Emits files to ./dist

Run: node build.js
*/

const fs = require('fs');
const path = require('path');
const { build } = require('esbuild');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const glob = require('glob');
const fse = require('fs-extra');
const sharp = require('sharp');
const { minify } = require('html-minifier-terser');

const SITE = path.resolve(__dirname);
const DIST = path.join(SITE, 'dist');
const ASSETS = path.join(SITE, 'assets');

async function buildCss(){
  const cssFile = path.join(SITE, 'css', 'styles.css');
  const css = await fs.promises.readFile(cssFile, 'utf8');
  const result = await postcss([autoprefixer, cssnano]).process(css, { from: undefined });
  await fse.outputFile(path.join(DIST, 'css', 'styles.min.css'), result.css);
  console.log('CSS built');
}

async function buildJs(){
  await build({
    entryPoints: [path.join(SITE,'js','main.js')],
    bundle: true,
    minify: true,
    sourcemap: false,
    outfile: path.join(DIST,'js','main.js')
  });
  console.log('JS built');
}

async function optimizeImages(){
  const imagesDir = path.join(ASSETS,'images');
  const files = glob.sync('**/*.{png,jpg,jpeg,svg}', { cwd: imagesDir });
  await Promise.all(files.map(async (f) => {
    const src = path.join(imagesDir, f);
    const dstDir = path.join(DIST,'assets','images', path.dirname(f));
    await fse.ensureDir(dstDir);
    const ext = path.extname(f).toLowerCase();
    const base = path.basename(f, ext);
    // copy original (for svg keep original)
    await fse.copy(src, path.join(dstDir, base + ext));
    // For raster images, create responsive sizes and webp/avif
    if(ext !== '.svg'){
      const img = sharp(src);
      const widths = [480, 768, 1200];
      for(const w of widths){
        await img.clone().resize({ width: w }).toFile(path.join(dstDir, `${base}-${w}${ext}`));
        await img.clone().resize({ width: w }).webp().toFile(path.join(dstDir, `${base}-${w}.webp`));
        await img.clone().resize({ width: w }).avif().toFile(path.join(dstDir, `${base}-${w}.avif`));
      }
    }
  }));
  console.log('Images optimized');
}

async function copyAndMinifyHtml(){
  const htmlFiles = glob.sync('*.html', { cwd: SITE });
  await Promise.all(htmlFiles.map(async (f)=>{
    const html = await fs.promises.readFile(path.join(SITE, f), 'utf8');
    // replace CSS/JS references to minified outputs
    let out = html.replace(/css\/styles\.css/g, 'css/styles.min.css').replace(/js\/main\.js/g, 'js/main.js');
    // ensure images refer to assets/images/ (they already do)
    const min = await minify(out, { collapseWhitespace: true, removeComments: true, removeRedundantAttributes: true });
    await fse.outputFile(path.join(DIST,f), min);
  }));
  console.log('HTML copied + minified');
}

async function copyOtherAssets(){
  // Copy static files like favicon if present
  const staticFiles = ['favicon.ico','robots.txt','sitemap.xml'];
  await Promise.all(staticFiles.map(async (f)=>{
    const src = path.join(SITE, f);
    if(fs.existsSync(src)) await fse.copy(src, path.join(DIST, f));
  }));
}

(async function(){
  try{
    await fse.remove(DIST);
    await buildCss();
    await buildJs();
    await optimizeImages();
    await copyAndMinifyHtml();
    await copyOtherAssets();
    console.log('Build complete — output in ./dist');
  }catch(err){
    console.error(err);
    process.exit(1);
  }
})();
