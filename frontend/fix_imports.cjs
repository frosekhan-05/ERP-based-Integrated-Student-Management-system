const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = getAllFiles(srcDir);
const fileLookup = {};
for (const file of allFiles) {
  const baseName = path.basename(file, path.extname(file));
  if (!fileLookup[baseName]) {
    fileLookup[baseName] = [];
  }
  fileLookup[baseName].push(file);
}

function resolveImport(currentFilePath, importPath) {
  const currentDir = path.dirname(currentFilePath);
  const targetPath = path.resolve(currentDir, importPath);
  
  const extensions = ['', '.js', '.jsx', '/index.js', '/index.jsx'];
  for (const ext of extensions) {
    if (fs.existsSync(targetPath + ext) && fs.statSync(targetPath + ext).isFile()) {
      return true;
    }
  }
  return false;
}

function getCorrectRelativePath(currentFilePath, targetFilePath) {
  const currentDir = path.dirname(currentFilePath);
  let relativePath = path.relative(currentDir, targetFilePath);
  relativePath = relativePath.replace(/\\/g, '/');
  
  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath;
  }
  
  // Remove extension for JS/JSX
  relativePath = relativePath.replace(/\.jsx?$/, '');
  
  return relativePath;
}

const importRegex = /(import|export)\s+([^'"]*)\s+from\s+['"](\.[^'"]+)['"]/g;

let changes = [];

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const statement = match[0];
    const importType = match[1];
    const importItems = match[2];
    const importPath = match[3];

    if (!resolveImport(file, importPath)) {
      // It's broken. Try to fix it.
      const targetBaseName = path.basename(importPath);
      const possibleTargets = fileLookup[targetBaseName] || [];

      if (possibleTargets.length === 1) {
        const correctPath = getCorrectRelativePath(file, possibleTargets[0]);
        const newStatement = `${importType} ${importItems} from '${correctPath}'`;
        newContent = newContent.replace(statement, newStatement);
        changes.push({
          file: path.relative(__dirname, file),
          old: importPath,
          new: correctPath
        });
      } else if (possibleTargets.length > 1) {
        console.log(`[Warning] Multiple targets found for ${targetBaseName} in ${file}. Cannot auto-fix.`);
      } else {
        console.log(`[Warning] Target ${targetBaseName} not found for ${file}.`);
      }
    }
  }

  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
  }
}

if (changes.length > 0) {
  console.log('Fixed Imports:');
  for (const change of changes) {
    console.log(`File: ${change.file}`);
    console.log(`  - ${change.old}`);
    console.log(`  + ${change.new}`);
  }
} else {
  console.log('No broken relative imports found that could be auto-fixed.');
}
