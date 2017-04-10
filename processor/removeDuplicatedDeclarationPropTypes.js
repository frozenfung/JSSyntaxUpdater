const removeDuplicatedDeclarationPropTypes = {
  run(commands) {
    const syntax = /const PropTypes/;

    return commands.filter((command) => {
      if (syntax.test(command)) {
        return false;
      } else {
        return true;
      }
    });
  }
};

module.exports = removeDuplicatedDeclarationPropTypes;
