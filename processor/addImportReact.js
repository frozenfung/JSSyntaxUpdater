const addImportReact = {
  run(commands) {
    const importReactSyntax = /from 'react'/;

    const isImportReact = commands.find((command) => {
      if(importReactSyntax.test(command)) {
        return true;
      } else {
        return false;
      }
    });

    const syntax = 'import React, { Component, PropTypes } from \'react\'\n';

    if (!isImportReact) {
      let newCommands = commands;
      newCommands.splice(2, 0, syntax);
      return newCommands;
    } else {
      return commands;
    }
  },
};

module.exports = addImportReact;
