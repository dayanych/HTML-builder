const fs = require('fs').promises;
const path = require('path');

const filesDir = path.join(__dirname, 'files');
const filesCopyDir = path.join(__dirname, 'files-copy');

async function backupFiles() {
  try {
    await fs.mkdir(filesCopyDir, { recursive: true });
    const files = await fs.readdir(filesDir);
    for (const file of files) {
      const sourcePath = path.join(filesDir, file);
      const destPath = path.join(filesCopyDir, file);
      await fs.copyFile(sourcePath, destPath);
    }
    const filesCopy = await fs.readdir(filesCopyDir);
    for (const fileCopy of filesCopy) {
      if (!files.includes(fileCopy)) {
        const deletePath = path.join(filesCopyDir, fileCopy);
        await fs.unlink(deletePath);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

backupFiles();
