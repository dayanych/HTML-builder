const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const mainFilesDir = path.join(__dirname, 'project-dist');
const styleDir = path.join(__dirname, 'styles')
const assestDir = path.join(__dirname, 'assets');
const assestCopyDir = path.join(__dirname, 'project-dist', 'assets');
const templateDir = path.join(__dirname, 'template.html');
const htmlsDir = path.join(__dirname, 'components');

// создание папки project-dist
async function backupFiles(dir, copyDir) {
  try {
    await fsPromises.mkdir(mainFilesDir, { recursive: true });
    
    await fsPromises.mkdir(copyDir, { recursive: true });
    const files = await fsPromises.readdir(dir);
    const filesDir = await fsPromises.readdir(dir, { withFileTypes: true });
    
    for (const file of filesDir) {
      if (file.isDirectory()) {
        backupFiles(path.join(dir, file.name), path.join(copyDir, file.name));
      } else {
        const sourcePath = path.join(dir, file.name);
        const destPath = path.join(copyDir, file.name);
        await fsPromises.copyFile(sourcePath, destPath);
      }
    }
    const filesCopy = await fsPromises.readdir(copyDir);
    for (const fileCopy of filesCopy) {
      if (!files.includes(fileCopy)) {
        const deletePath = path.join(copyDir, fileCopy);
        await fsPromises.unlink(deletePath);
      }
    }
  } catch (err) {
    console.error(err);
  }
}
// создание index.html
function createHTML() {
  let template;
  const templateObj = {};
  fs.readFile(templateDir, 'utf-8', (err, data) => {
    if (err) throw err;
    template = data.match(/{{[a-zA-Z]+}}/g);
    fs.writeFile(path.join(mainFilesDir, 'index.html'), data, 'utf-8', (err) => {
      if (err) throw err;
    });
  });
  fs.readdir(htmlsDir, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      const fileName = file.split('.')[0];
      const filePath = path.join(htmlsDir, file);
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) throw err;
        templateObj[`{{${fileName}}}`] = data;
        fs.readFile(path.join(mainFilesDir, 'index.html'), 'utf-8', (err, fileData) => {
          if (err) throw err;
          for (let i = 0; i < template.length; i++) {
            fileData = fileData.replace(template[i], templateObj[`${template[i]}`]);
          }
          fs.writeFile(path.join(mainFilesDir, 'index.html'), fileData, 'utf-8', (err) => {
            if (err) throw err;
          });
        });
      });
    });
  });
};

// создание стилей
function createStyles() {
  const style = fs.createWriteStream(path.join(mainFilesDir, 'style.css'));
  fs.readdir(styleDir, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fs.createReadStream(path.join(styleDir, file)).pipe(style);
    });
  });
}

backupFiles(assestDir, assestCopyDir);
createHTML();
createStyles();