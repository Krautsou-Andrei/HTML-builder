const fs = require('fs');
const path = require('node:path');

const ROOT = path.join(__dirname, 'text.txt');

let stream = new fs.ReadStream(ROOT);

stream.on('readable', function () {
  let data = stream.read();
  if (data == null) {
    return;
  }
  console.log(data.toString());
});

stream.on('error', function (error) {
  if (error.code == 'ENOENT') {
    console.error('файл не найден');
  } else {
    console.error(error);
  }
});
