const { readdir } = require('node:fs/promises');
const path = require('node:path');
const { stat } = require('node:fs');

const ROOT = path.join(__dirname, 'secret-folder');

const read = async (directory) => {
  const file = await readdir(directory, { withFileTypes: true })
    .then((result) => {
      result.forEach((element) => {
        if (element.isFile()) {
          const PATH_FILE = path.join(directory, element.name);
          const [name, prefix] = element.name.split('.');

          stat(PATH_FILE, (error, stat) => {
            if (error) {
              console.log(error);
            } else {
              const fileSize = (stat.size / 1024).toFixed(2);
              console.log(name, '-', prefix, '-', `${fileSize}Kb`);
            }
          });
        }
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

read(ROOT);
