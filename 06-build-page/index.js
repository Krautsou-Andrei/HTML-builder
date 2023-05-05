const path = require('node:path');
const { readFile, writeFile } = require('node:fs/promises');
const { buildCSS } = require('../05-merge-styles');
const { copyDirectory } = require('../04-copy-directory');

const CONSTANTS = {
  INPUT_DIRECTORY_STYLE: 'styles',
  OUTPUT_DIRECTORY_STYLE: 'project-dist',
  OUTPUT_FILE_STYLE: 'style.css',
  OUTPUT_FILE_HTML: 'index.html',
  INPUT_DIRECTORY_ASSETS: 'assets',
  OUTPUT_DIRECTORY: 'project-dist',
  INPUT_DIRECTORY_COMPONENTS: 'components',
  INPUT_TEMPLATE: 'template.html',
};

const pathInputDirectoryStyle = path.join(__dirname, CONSTANTS.INPUT_DIRECTORY_STYLE);
const pathOutputDirectoryStyle = path.join(__dirname, CONSTANTS.OUTPUT_DIRECTORY_STYLE);
const pathInputDirectoryAssets = path.join(__dirname, CONSTANTS.INPUT_DIRECTORY_ASSETS);
const pathOutputDirectoryAssets = path.join(__dirname, CONSTANTS.OUTPUT_DIRECTORY, CONSTANTS.INPUT_DIRECTORY_ASSETS);
const pathInputDirectoryComponents = path.join(__dirname, CONSTANTS.INPUT_DIRECTORY_COMPONENTS);
const pathTemplate = path.join(__dirname, CONSTANTS.INPUT_TEMPLATE);
const pathOutputDirectory = path.join(__dirname, CONSTANTS.OUTPUT_DIRECTORY);

const buildHTML = async (template, components, outputDirectory, outputFileName) => {
  let templateHTML = await readFile(template, 'utf8');
  const matches = templateHTML.match(/{{(\w+)}}/g);

  await Promise.all(
    [...matches].map(async (component) => {
      const componentName = component.match(/(\w+)/g)[0];
      let componentFile = path.join(components, `${componentName}.html`);
      const componentHTML = await readFile(componentFile, 'utf8');
      templateHTML = templateHTML.replace(component, componentHTML);
    })
  );

  await writeFile(path.join(outputDirectory, outputFileName), templateHTML, 'utf-8');
};

const copyAssets = async (pathInputDirectoryAssets, pathOutputDirectoryAssets, pathInputDirectoryStyle, pathOutputDirectoryStyle, pathInputDirectoryComponents, pathTemplate, pathOutputDirectory, outputFileNameCSS, outputFileNameHTML) => {
  await copyDirectory(pathInputDirectoryAssets, pathOutputDirectoryAssets);
  await buildHTML(pathTemplate, pathInputDirectoryComponents, pathOutputDirectory, outputFileNameHTML);
  await buildCSS(pathInputDirectoryStyle, pathOutputDirectoryStyle, outputFileNameCSS);
};

copyAssets(pathInputDirectoryAssets, pathOutputDirectoryAssets, pathInputDirectoryStyle, pathOutputDirectoryStyle, pathInputDirectoryComponents, pathTemplate, pathOutputDirectory, CONSTANTS.OUTPUT_FILE_STYLE, CONSTANTS.OUTPUT_FILE_HTML);
