Array.prototype.reIndexOf = function (rx) {
  for (var i in this) {
    if (this[i].toString().match(rx)) {
      return i;
    }
  }
  return -1;
};

let copying = false;
let lineToBeRemoved = [];
const targetSyntax = [
  {
    start: /\.propTypes/,
    end: /};/,
  }, {
    start: /\.defaultProps/,
    end: /};/,
  }, {
    start: /\.childContextTypes/,
    end: /};/,
  }
];

const makePropertyStatic = {
  run(commands) {
    function startCopying() {
      copying = true;
    }

    function endCopying() {
      copying = false;
    }

    function findClassDefinitionIndex(commands) {
      const regex = /class \w+ extends/;
      return commands.reIndexOf(regex);
    }

    function getTargetSyntaxFromCommands(commands) {
      let targets = [];

      targetSyntax.forEach((syntax) => {
        commands.forEach((command, index) => {
          if (syntax.start.test(command)) {
            startCopying();
          }

          if (copying) {
            targets.push(command);
            lineToBeRemoved.push(index);
          }

          if (syntax.end.test(command) && copying) {
            targets.push('');
            endCopying();
          }
        });
      });

      return modifiedTargetSyntax(targets);
    }

    function modifiedTargetSyntax(targets) {
      return targets.map((target) => {
        let modifiedTarget = target;

        targetSyntax.forEach((syntax) => {
          if (syntax.start.test(target)) {
            modifiedTarget = modifiedTarget.replace(/(\w+\.)/, 'static ');
          }

          if (syntax.end.test(target)) {
            modifiedTarget = modifiedTarget.replace(/;/, '');
          }
        });

        if (target === '') {
          return modifiedTarget;
        } else {
          return `  ${modifiedTarget}`;
        }
      });
    }

    function removeTargetSyntaxFromCommands(commands) {
      commands.splice(lineToBeRemoved[0], lineToBeRemoved.length + 1);
    }

    function getEntryPoint() {
      return parseInt(findClassDefinitionIndex(commands), 10) + 1;
    }

    const targets = getTargetSyntaxFromCommands(commands);
    removeTargetSyntaxFromCommands(commands);

    const entryPoint = getEntryPoint();
    const args = [entryPoint, 0].concat(targets);
    Array.prototype.splice.apply(commands, args);

    return commands;
  },
};

module.exports = makePropertyStatic;
