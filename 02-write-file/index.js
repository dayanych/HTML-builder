const fs = require('fs');
const path = require('path');
const process = require('node:process');

const pathJoin = path.join(__dirname, 'text.txt')
const output = fs.createWriteStream(pathJoin);

const { stdin, stdout } = process;
stdout.write('Текст:\n');
stdin.on('data', (data) => {
  const input = data.toString().trim(); 
  if (input === 'exit') {
    stdout.write('Текст записан в text.txt');
    process.exit(0)
  }
  output.write(data)
});

process.on('SIGINT', () => {
  stdout.write('Текст записан в text.txt');
  process.exit(0);
});