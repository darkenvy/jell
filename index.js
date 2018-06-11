const _require = require;
const fs = _require('fs');
const os = _require('os');
const path = _require('path');
const shell = _require('shelljs');
const builtinModules = require('builtin-modules');
const JSHELL = path.join(os.homedir(), '.jshell_modules');
const JSHELL_MODULES = path.join(JSHELL, 'node_modules');

if (!fs.existsSync(JSHELL_MODULES)) shell.mkdir(JSHELL_MODULES);


function isBuiltinModules(nodeModule) {
  return builtinModules.indexOf(nodeModule) !== -1;
}

function checkModule(nodeModule) {
  return fs.existsSync(path.join(JSHELL_MODULES, nodeModule))
}

function installModule(nodeModule) {
  return shell.exec(`npm install ${nodeModule} --prefix ${JSHELL}`);
}

module.exports = () => {
  return function() {
    const moduleName = arguments[0];
    const moduleExists = checkModule(moduleName);

    if (!moduleExists) installModule(moduleName);

    // If builtin modules, just import directly. Otherwise, prepend $HOME path
    if (isBuiltinModules(moduleName)) return _require(moduleName);
    return _require(path.join(JSHELL_MODULES, moduleName));
  };
};
