const fs = require('fs');
const path = require('path');

const projectPath = path.join(__dirname, 'project-dist');

const templateFilePath = path.join(__dirname, 'template.html');
const htmlFilePath = path.join(__dirname, 'project-dist', 'index.html');
const componentsDirPath = path.join(__dirname, 'components');

const stylesDirPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'style.css');

const assetsDirPath = path.join(__dirname, 'assets');
const assetsDirCopyPath = path.join(__dirname, 'project-dist', 'assets');

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

fs.rmdir(projectPath, { recursive: true }, () => {
  fs.mkdir(projectPath, { recursive: true }, () => {
    fs.readFile(templateFilePath, { encoding: 'utf-8' }, (_err, data) => {
      let templateFileData = data;

      fs.readdir(componentsDirPath, { withFileTypes: true }, (_err, files) => {
        files.forEach((file) => {
          if (path.extname(file.name) === '.html') {
            const templateTag = `{{${file.name.split('.')[0]}}}`;
            if (templateFileData.includes(templateTag)) {
              const filePath = path.join(componentsDirPath, file.name);
              fs.readFile(filePath, { encoding: 'utf-8' }, (_err, data) => {
                templateFileData = templateFileData.replace(templateTag, data);

                fs.createWriteStream(htmlFilePath, { encoding: 'utf-8' }).write(
                  templateFileData,
                );
              });
            }
          }
        });
      });
    });

    const bundleWriteStream = fs.createWriteStream(bundlePath);
    fs.rm(bundlePath, { recursive: true }, () => {
      fs.readdir(
        stylesDirPath,
        { withFileTypes: true, encoding: 'utf-8' },
        (_err, files) => {
          files.forEach((file) => {
            if (!file.isDirectory() && path.extname(file.name) === '.css') {
              const filePath = path.join(stylesDirPath, file.name);
              fs.createReadStream(filePath).pipe(bundleWriteStream);
            }
          });
        },
      );
    });

    copyDir(assetsDirPath, assetsDirCopyPath);
  });
});
