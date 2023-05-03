const fs = require('fs');
const path = require('path');

const styleDir = path.join(__dirname, 'styles');
const bundleDir = path.join(__dirname, 'project-dist', 'bundle.css');
const bundle = fs.createWriteStream(bundleDir);

fs.readdir(styleDir, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    if (file.name.endsWith('.css') && !file.isDirectory()) {
      fs.readFile(path.join(styleDir, file.name), 'utf-8', (err, data) => {
        if (err) throw err;
        bundle.write(data)
      });
    }
  });
});

