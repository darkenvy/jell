module.exports = (() => {
  const fs = require('fs');
  const os = require('os');
  const path = require('path');
  const shell = require('shelljs');
  const builtinModules = require('builtin-modules');
  
  const NAME = 'j-Shell';
  const JSHELL = path.join(os.homedir(), '.jshell_modules');
  const JSHELL_MODULES = path.join(JSHELL, 'node_modules');
  
  // if first ran, create directory
  if (!fs.existsSync(JSHELL_MODULES)) shell.mkdir(JSHELL_MODULES);
  
  // merge specified modules with this module's scope
  const selfModules = ['fs-extra', 'shelljs'];
  let $ = {};
  selfModules.forEach(mod => {
    $ = Object.assign($, require(mod));
  });
  
  // include is the require replacement
  $.include = function() {
    const moduleName = arguments[0];
    console.log('---', moduleName);
  
    // If builtin modules, just import directly. Otherwise, [install &] prepend $HOME path
    const isBuiltInModule = builtinModules.indexOf(moduleName) !== -1;
    if (isBuiltInModule) return require(moduleName);
  
    // install if module does not exist. Syncronously
    const moduleExists = fs.existsSync(path.join(JSHELL_MODULES, moduleName))
    if (!moduleExists) {
      console.log(`${NAME} is installing the module ${moduleName}`);
      shell.exec(`npm install ${moduleName} --prefix ${JSHELL}`);
    }
  
    // return imported module
    return require(path.join(JSHELL_MODULES, moduleName));
  };
  
  // alias
  $.require = $.include;
  
  return $;
})();
