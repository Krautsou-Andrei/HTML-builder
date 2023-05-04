const fs = require('fs');
const path = require('node:path');
const process = require('node:process');

const ROOT = path.join(__dirname, 'text.txt');

console.log('Enter text');
const streamWrite = new fs.WriteStream(ROOT);

let stdin = process.openStdin();

stdin.on('data', function (chunk) {
  console.log('Entered text:' + chunk);

  if (chunk.toString().trim() === 'exit') {
    exit();
  }

  streamWrite.write(chunk);

  console.log('Enter text');
});

stdin.on('error', function (error) {
  console.error(error);
});

process.on('error', function (error) {
  console.error(error);
});

function exit() {
  console.log('bye');
  process.exit();
}
