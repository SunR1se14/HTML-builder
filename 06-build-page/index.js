const fs = require('fs').promises;
const path = require('path');

const distFolder = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');
const stylesFolder = path.join(__dirname, 'styles');
const assetsFolder = path.join(__dirname, 'assets');

const createDist = async () => {
  try {
    await fs.access(distFolder);
  } catch (error) {
    try {
      await fs.mkdir(distFolder, { recursive: true });
      await fs.mkdir(path.join(distFolder, 'assets'), { recursive: true });
    } catch (error) {
      console.error('Error:', error);
    }
  }
};

const readTemplateFile = async () => {
  try {
    const templateContent = await fs.readFile(templatePath, 'utf8');
    return templateContent;
  } catch (error) {
    console.error('Error:', error);
  }
};

const findTemplateTags = (templateContent) => {
  const regex = /\{\{([^}]+)\}\}/g;
  const matches = templateContent.match(regex);
  return matches ? matches.map((match) => match.slice(2, -2).trim()) : [];
};

const replaceTemplateTags = async (templateContent, tags) => {
  for (const tag of tags) {
    const componentPath = path.join(componentsFolder, `${tag}.html`);
    try {
      const componentContent = await fs.readFile(componentPath, 'utf8');
      templateContent = templateContent.replace(
        new RegExp(`{{${tag}}}`, 'g'),
        componentContent,
      );
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return templateContent;
};

const writeToDist = async (modifiedTemplate) => {
  const distFilePath = path.join(distFolder, 'index.html');
  try {
    await fs.writeFile(distFilePath, modifiedTemplate);
  } catch (error) {
    console.error('Error:', error);
  }
};

const mergeStyles = async () => {
  const distPath = path.join(distFolder, 'style.css');
  let stylesContent = '';

  const files = await fs.readdir(stylesFolder, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(stylesFolder, file.name);
    const fileExt = path.parse(filePath).ext.slice(1);

    if (file.isFile() && fileExt === 'css') {
      const fileContent = await fs.readFile(filePath, 'utf8');
      stylesContent += fileContent;
    }
  }

  try {
    await fs.writeFile(distPath, stylesContent, 'utf8');
  } catch (error) {
    console.error('Error:', error);
  }
};

const copyContent = async (source, dist) => {
  try {
    await fs.access(dist);
  } catch (err) {
    await fs.mkdir(dist, { recursive: true });
  }

  const items = await fs.readdir(source, { withFileTypes: true });

  for (const item of items) {
    const sourcePath = path.join(source, item.name);
    const distPath = path.join(dist, item.name);

    if (item.isFile()) {
      const content = await fs.readFile(sourcePath);
      await fs.writeFile(distPath, content);
    } else if (item.isDirectory()) {
      await copyContent(sourcePath, distPath);
    }
  }
};

const buildProject = async () => {
  await createDist();
  const templateContent = await readTemplateFile();

  if (templateContent) {
    const tags = findTemplateTags(templateContent);
    const modifiedTemplate = await replaceTemplateTags(templateContent, tags);
    await writeToDist(modifiedTemplate);
  }

  await mergeStyles();
  await copyContent(assetsFolder, path.join(distFolder, 'assets'));
};

buildProject();
