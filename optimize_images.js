const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const directoryPath = path.join(process.cwd(), 'public/images');

async function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await processDirectory(fullPath);
        } else if (file.match(/\.(jpg|jpeg)$/i)) {
            console.log(`Processing ${fullPath}`);
            const tempPath = fullPath + '.tmp';
            try {
                await sharp(fullPath)
                    .resize({ width: 1600, withoutEnlargement: true })
                    .jpeg({ quality: 75, progressive: true })
                    .toFile(tempPath);
                fs.renameSync(tempPath, fullPath);
            } catch (err) {
                console.error(`Failed to process ${fullPath}:`, err);
            }
        } else if (file.match(/\.(png)$/i)) {
             console.log(`Processing ${fullPath}`);
             const tempPath = fullPath + '.tmp';
             try {
                await sharp(fullPath)
                    .resize({ width: 1600, withoutEnlargement: true })
                    .png({ quality: 75, compressionLevel: 9 })
                    .toFile(tempPath);
                fs.renameSync(tempPath, fullPath);
             } catch (err) {
                console.error(`Failed to process ${fullPath}:`, err);
             }
        }
    }
}

processDirectory(directoryPath).then(() => console.log('Done optimizing images.')).catch(err => console.error(err));
