const { mkdir, readdir, copyFile, rm } = require('node:fs/promises');
const path = require('path');

const pathDirectory = path.join(__dirname, 'files');
const pathDirectoryCopy = path.join(__dirname, 'files-copy');

const copyDirectory = async (pathDirectory, pathDirectoryCopy) => {
  try {
    await rm(pathDirectoryCopy, { recursive: true });
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Дирректории ${error.path.split('\\').pop()} не существует, создадим ее заново`);
    } else {
      console.error(error.message);
    }
  }

  try {
    await mkdir(pathDirectoryCopy, { recursive: true });
  } catch (error) {
    console.error(error.message);
  }

  const files = await readDirectory(pathDirectory);

  try {
    await copy(files, pathDirectory, pathDirectoryCopy);
  } catch (error) {
    console.error(error.message);
  }
};

const readDirectory = async (pathDirectory) => {
  return await readdir(pathDirectory, { withFileTypes: true })
    .then((result) => {
      return result;
    })
    .catch((error) => console.error(error.message));
};

const copy = async (files, pathDirectory, pathDirectoryCopy) => {
  files.forEach((file) => {
    const pathInputFile = path.join(pathDirectory, file.name);
    const pathOutPathFile = path.join(pathDirectoryCopy, file.name);

    if (file.isFile()) {
      copyFile(pathInputFile, pathOutPathFile);
    } else {
      copyDirectory(pathInputFile, pathOutPathFile);
    }
  });
};

copyDirectory(pathDirectory, pathDirectoryCopy);

module.exports = {
  copyDirectory,
};
