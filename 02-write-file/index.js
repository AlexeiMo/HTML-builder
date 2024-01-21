const fs = require('fs');
const path = require('path');

const { stdin, stdout, exit } = process;

const filePath = path.join(__dirname, 'text.txt');
const writeableStream = fs.createWriteStream(filePath);

function exitProgram() {
  stdout.write('Thanks for your info! Goodbye!');
  exit();
}

stdout.write('Hello! Please, enter the text you want to put in the file:\n');

stdin.on('data', (data) => {
  data = data.toString().trimEnd();
  if (data === 'exit') exitProgram();
  writeableStream.write(data);
});

process.on('SIGINT', exitProgram);
