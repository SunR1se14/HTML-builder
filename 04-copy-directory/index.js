const path = require('path');
const fs = require('fs').promises;

const mainPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

const copyDir = async (source = mainPath, dist = copyPath) => {
  try {
    await fs.access(dist);
    await fs.rm(dist, { recursive: true });
  } catch (err) {
    console.log('Error: ' + err.message);
  }

  await fs.mkdir(dist, { recursive: true });
  const items = await fs.readdir(source, { withFileTypes: true });

  for (const item of items) {
    const sourcePath = path.join(source, item.name);
    const distPath = path.join(dist, item.name);

    if (item.isFile()) {
      await copyFile(sourcePath, distPath);
    } else if (item.isDirectory()) {
      await copyDir(sourcePath, distPath);
    }
  }

  console.log('Copied successfully!');
};

const copyFile = async (source, dist) => {
  const content = await fs.readFile(source);
  await fs.writeFile(dist, content);
};

copyDir();
