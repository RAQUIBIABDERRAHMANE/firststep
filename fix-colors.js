const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const targetDir = 'd:\\firststep\\app\\dashboard';
const targetComponentsDir = 'd:\\firststep\\components\\dashboard';

function processFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content
        .replace(/text-muted-foreground/g, 'text-slate-500')
        .replace(/text-foreground/g, 'text-slate-900');
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Updated:', filePath);
    }
}

walkDir(targetDir, processFile);
walkDir(targetComponentsDir, processFile);
console.log('Done.');
