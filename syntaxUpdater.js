const fs = require('fs');
const path = require('path');

// strategies
const updateRequireToImport = require('./processor/updateRequireToImport');
const addImportReact = require('./processor/addImportReact');
const removeDuplicatedDeclarationPropTypes = require('./processor/removeDuplicatedDeclarationPropTypes');
const replaceModuleExportsWithExportDefault = require('./processor/replaceModuleExportsWithExportDefault');
const makePropertyStatic = require('./processor/makePropertyStatic');

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
  return commands.join('\n');
}

function transfer(file) {
  let commands = _parseCode(file);

  const processors = [
    updateRequireToImport,
    addImportReact,
    removeDuplicatedDeclarationPropTypes,
    replaceModuleExportsWithExportDefault,
    makePropertyStatic
  ];

  processors.forEach((processor) => {
    commands = processor.run(commands);
  });

  return _joinLineWithLineBreak(commands);
}

function readThenWrite(inputFilename) {
  const inputFile = _readFile(inputFilename);
  const output = transfer(inputFile);
  _writeFile(inputFilename, output);
}

// process
const ap = process.argv[2];

fs.stat(ap, (err, stats) => {
  if (stats.isFile()) {
    readThenWrite(ap);
  }

  if (stats.isDirectory()) {
    fs.readdir(ap, (err, files) => {
      files.forEach(file => {
        const fp = path.join(ap, file);
        readThenWrite(fp);
      });
    })
  }
});

