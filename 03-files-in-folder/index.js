const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(
  dirPath,
  { withFileTypes: true, encoding: 'utf-8' },
  (_error, files) => {
    files.forEach((file) => {
      if (!file.isDirectory()) {
        const fileName = path
          .basename(file.name)
          .split('.')
          .slice(0, -1)
          .join('.');
        const extName = path.extname(file.name).slice(1);

        const filePath = path.join(dirPath, file.name);
        fs.stat(filePath, (_error, stats) => {
          const fileSize = stats.size;
          process.stdout.write(
            fileName + ' - ' + extName + ' - ' + fileSize + ' b\n',
          );
        });
      }
    });
  },
);
