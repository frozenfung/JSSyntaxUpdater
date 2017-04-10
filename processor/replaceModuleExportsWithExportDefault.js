const replaceModuleExportsWithExportDefault = {
  run(commands) {
    let isRemoveLinesBelow = false;

    function removeModuleExport(command) {
      const target = /module.exports/;

      if (target.test(command) || isRemoveLinesBelow) {
        isRemoveLinesBelow = true;

        return false;
      } else {
        return command;
      }
    }

    function updateSyntax(command) {
      const target = / ?class \w+ extends /;

      if (target.test(command)) {
        let newCommand = command.replace(/React\./, '');
        newCommand = newCommand.replace(/(\D+)?class/, 'export default class')
        return newCommand;
      } else {
        return command;
      }
    }

    return commands
      .map(updateSyntax)
      .map(removeModuleExport)
      .filter((command) => command !== false);
  }
};

module.exports = replaceModuleExportsWithExportDefault;
