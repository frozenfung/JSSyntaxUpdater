const fs = require('fs');

// strategies
const updateRequireToImport = require('./processor/updateRequireToImport');

function _readFile(filename) {
  function cb(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The file was readed!");
  }

  return fs.readFileSync(filename, "UTF-8", cb);
}

function _writeFile(filename, result) {
  function cb(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  }

  fs.writeFile(filename, result, cb);
}

function _parseCode(file) {
  const re = /\n/;
  return file.split(re);
}

function _joinLineWithLineBreak(commands) {
  return command.join('\n');
}

function transfer(file) {
  let commands = _parseCode(file);

  const processors = [
    updateRequireToImport
  ];

  processors.forEach((processor) => {
    commands = processor.run(commands);
  });

  return _joinLineWithLineBreak(commands);
}

// process
const inputFilename = process.argv[2];
const inputFile = _readFile(inputFilename);

const output = transfer(inputFile);

_writeFile(inputFilename, output);
