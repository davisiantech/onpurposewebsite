const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const images = path.join(__dirname, '../images');
const output = path.join(images, 'optimized');
fs.mkdirSync(output, { recursive: true });
for (const file of fs.readdirSync(images).filter(name => /^hero-\d+\.(jpe?g|png|webp)$/i.test(name))) {
    const stem = path.parse(file).name;
    for (const width of [640, 1200]) {
        execFileSync('cwebp', ['-quiet', '-q', '76', '-m', '6', '-metadata', 'none', '-resize', String(width), '0', path.join(images, file), '-o', path.join(output, `${stem}-${width}.webp`)]);
    }
    console.log(`Optimized ${file}`);
}
