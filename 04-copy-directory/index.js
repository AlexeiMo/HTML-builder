const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files');
const dirCopyPath = path.join(__dirname, 'files-copy');
fs.rmdir(dirCopyPath, { recursive: true }, () => {
  fs.mkdir(dirCopyPath, { recursive: true }, () => {
    fs.readdir(
      dirPath,
      { withFileTypes: true, encoding: 'utf-8' },
      (_err, files) => {
        files.forEach((file) => {
          const filePath = path.join(dirPath, file.name);
          const fileCopyPath = path.join(dirCopyPath, file.name);
          fs.copyFile(filePath, fileCopyPath, (_err) => {
            if (_err) process.stdout.write(_err.message);
          });
        });
      },
    );
  });
});
