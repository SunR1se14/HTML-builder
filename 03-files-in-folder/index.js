const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, data) => {
    if (err) {
      console.log('Error: ' + err.message);
    } else {
      data
        .filter((item) => !item.isDirectory())
        .forEach((item) => {
          const filePath = path.join(__dirname, 'secret-folder', item.name);
          const fileExt = path.extname(filePath).slice(1);
          const fileName = path.basename(filePath).replace(`.${fileExt}`, '');

          fs.stat(filePath, (err, info) => {
            if (err) {
              console.log('Error: ' + err.message);
            }

            const fileSize = (info.size / 1024).toFixed(3);

            console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
          });
        });
    }
  },
);
