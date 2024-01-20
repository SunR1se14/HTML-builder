const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const stream = fs.createWriteStream(
  path.join(__dirname, '02-write-file.txt'),
  'utf8',
);

stdout.write('Please, enter your text...\n');

const end = () => {
  stdout.write('Good Luck! \n');
  process.exit();
};

stdin.on('data', (data) => {
  if (data.toString().toLocaleLowerCase().trim() === 'exit') {
    end();
  } else {
    stream.write(data, 'utf8');
  }
});

process.on('SIGINT', end);
