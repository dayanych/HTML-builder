const fs = require('fs');
const path = require('path');

const pathJoin = path.join(__dirname, 'text.txt')
const stream = fs.createReadStream(pathJoin, 'utf-8');
let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log(data));