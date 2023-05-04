const { readdir } = require('node:fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const path = require('node:path');

const CONSTANTS = {
  INPUT_DIRECTORY: 'styles',
  OUTPUT_DIRECTORY: 'project-dist',
  OUTPUT_FILE: 'bundle.css',
};

const pathInputDirectory = path.join(__dirname, CONSTANTS.INPUT_DIRECTORY);
const pathOutputDirectory = path.join(__dirname, CONSTANTS.OUTPUT_DIRECTORY);

const readDirectory = async (inputDirectory) => {
  return await readdir(inputDirectory, { withFileTypes: true })
    .then((result) => {
      return result;
    })
    .catch((error) => console.error(error.message));
};

const buildCSS = async (pathInputDirectory, pathOutputDirectory, outputFileName) => {
  const files = await readDirectory(pathInputDirectory);
  const pathOutputFile = path.join(pathOutputDirectory, outputFileName);
  const outputFile = createWriteStream(pathOutputFile);

  await files.forEach((file) => {
    const pathInputFile = path.join(pathInputDirectory, file.name);
    if (file.isFile() && path.extname(file.name) === '.css') {
      createReadStream(pathInputFile).pipe(outputFile);
    }
  });
};

buildCSS(pathInputDirectory, pathOutputDirectory, CONSTANTS.OUTPUT_FILE);
