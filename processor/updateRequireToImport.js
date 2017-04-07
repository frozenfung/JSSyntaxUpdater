const updateRequireToImport = {
  run(data) {
    const regex = /const (\w+) = require\('(\S+)\.js(x)?'\)(\.class)?/;

    return data.map((line) => {
      if(regex.test(line)) {
        return line.replace(regex, 'import $1 from \'$2\'');
      }

      return line;
    });
  },
};

module.exports = updateRequireToImport;
