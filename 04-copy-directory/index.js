const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files');
const dirCopyPath = path.join(__dirname, 'files-copy');

const copyDir = (dirPath, copyDirPath) => {
  fs.rmdir(copyDirPath, { recursive: true }, () => {
    fs.mkdir(copyDirPath, { recursive: true }, () => {
      fs.readdir(
        dirPath,
        { withFileTypes: true, encoding: 'utf-8' },
        (_err, files) => {
          files.forEach((file) => {
            const filePath = path.join(dirPath, file.name);
            const fileCopyPath = path.join(copyDirPath, file.name);
            if (file.isDirectory()) copyDir(filePath, fileCopyPath);
            else {
              fs.copyFile(filePath, fileCopyPath, (_err) => {
                if (_err) process.stdout.write(_err.message + '\n');
              });
            }
          });
        },
      );
    });
  });
};

copyDir(dirPath, dirCopyPath);
