// const _require = require;
const fs = require('fs');
const os = require('os');
const path = require('path');
const shell = require('shelljs');
const builtinModules = require('builtin-modules');
const NAME = 'j-Shell';

const JSHELL = path.join(os.homedir(), '.jshell_modules');
const JSHELL_MODULES = path.join(JSHELL, 'node_modules');
const NODE_GLOBAL_SCOPE = (function() { return this; })();

class Jell {
  constructor(opts) {
    if (!fs.existsSync(JSHELL_MODULES)) shell.mkdir(JSHELL_MODULES);
    const selfModules = ['fs-extra', 'shelljs'];

    NODE_GLOBAL_SCOPE['include'] = this.include;
    selfModules.forEach(mod => this._includeOnSelf(mod));
    if (opts || (opts && opts.global)) selfModules.forEach(mod => this._includeGlobal(mod));
  }

  include() {
    const moduleName = arguments[0];
    const moduleExists = fs.existsSync(path.join(JSHELL_MODULES, moduleName))

    // install if module does not exist. Syncronousline
    if (!moduleExists) {
      console.log(`${NAME} is installing the module ${moduleName}`);
      shell.exec(`npm install ${moduleName} --prefix ${JSHELL}`);
    }

    // If builtin modules, just import directly. Otherwise, prepend $HOME path
    if (builtinModules.indexOf(moduleName) !== -1) return require(moduleName);
    return require(path.join(JSHELL_MODULES, moduleName));
  }

  _includeGlobal() {
    const moduleName = arguments[0];
    const mod = this.include(moduleName);
    for (let each in mod) {
      NODE_GLOBAL_SCOPE[each] = mod[each];
    }
    return mod;
  }

  _includeOnSelf() {
    const moduleName = arguments[0];
    const mod = this.include(moduleName);
    // add [moduleName] = module;
    this[moduleName] = mod;
    // add each keys in module to this.
    for (let each in mod) this[each] = mod[each];
    return mod;
  }
}

module.exports = new Jell();