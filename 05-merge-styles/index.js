const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.rm(bundlePath, { recursive: true }, () => {
  fs.readdir(
    dirPath,
    { withFileTypes: true, encoding: 'utf-8' },
    (_err, files) => {
      const bundleWriteStream = fs.createWriteStream(bundlePath);
      files.forEach((file) => {
        if (!file.isDirectory() && path.extname(file.name) === '.css') {
          const filePath = path.join(dirPath, file.name);
          fs.createReadStream(filePath).pipe(bundleWriteStream);
        }
      });
    },
  );
});
