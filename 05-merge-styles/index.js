const fs = require('fs');
const path = require('path');

const mainDir = path.join(__dirname, 'styles');
const dist = path.join(__dirname, 'project-dist', 'bundle.css');
const writeStream = fs.createWriteStream(dist, 'utf8');
let filesCount = 0;

fs.readdir(mainDir, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const filePath = path.join(mainDir, file.name);
    const fileExt = path.parse(filePath).ext.slice(1);

    if (file.isFile() && fileExt === 'css') {
      const readStream = fs.createReadStream(filePath, 'utf8');

      readStream.pipe(writeStream, { end: false });
      readStream.on('end', () => {
        filesCount++;

        if (filesCount === files.length) {
          writeStream.end();
          console.log('Styles compiled into bundle.css');
        }
      });
    }
  });
});
