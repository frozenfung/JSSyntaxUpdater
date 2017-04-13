const updateRequireToImport = {
  run(data) {
    const regex0 = /const (\w+) = require\('(\S+)\.js(x)?'\)(\.class)?/;
    const regex1 = /const (\w+) = require\('(\S+)'\)/;

    return data.map((line) => {
      if (regex0.test(line)) {
        return line.replace(regex0, 'import $1 from \'$2\'');
      } else if (regex1.test(line)) {
        return line.replace(regex1, 'import $1 from \'$2\'');
      } else {
        return line;
      }
    });
  },
};

module.exports = updateRequireToImport;
