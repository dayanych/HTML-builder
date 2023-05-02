const fs = require('fs');
const path = require('path');

const pathJoin = path.join(__dirname, 'secret-folder');

fs.readdir(pathJoin, { withFileTypes: true }, (err, files) => {
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      if (!file.isDirectory()) {
        fs.stat(`${pathJoin}/${file.name}`, (error, stats) => {
          console.log(file.name + ' - ' + path.extname(file.name).slice(1, path.extname(file.name).length) + ' - ' + stats.size / 1024 + 'kb');
        });
      }
    });
  }
});

