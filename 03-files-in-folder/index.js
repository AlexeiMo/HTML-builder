const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(
  dirPath,
  { withFileTypes: true, encoding: 'utf-8' },
  (_error, files) => {
    files.forEach((file) => {
      if (!file.isDirectory()) {
        const extName = path.extname(file.name).slice(1);
        const fileName =
          extName.length === 0
            ? path.basename(file.name)
            : path.basename(file.name).slice(0, -extName.length - 1);

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
