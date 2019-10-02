#!/usr/bin/env node

/* Note the naming convention. This is because we use eval to run the incoming file.
We must use eval instead of Function as this is the only way to override node's require.
The side effect is that whatever we put into scope here, will be in the scope of
the file we are running. So we namespace it appropriately. __jell__ was chosen to inform
others looking around that this is to not be messed with. */

// ----------------------- import modules for our use ----------------------- //

const __jell__ = (function() {
  const originalRequire = require;
  const fs = require('fs');
  const path = require('path');
  const os = require('os');
  const child_process = require('child_process');

  const executable = path.join(process.cwd(), process.argv.slice(-1)[0]);
  const dirname = path.dirname(executable);
  const file = fs.readFileSync(executable, 'utf8').replace(/^#!.+/, '');
  const nodeModulesPath = path.join(dirname, 'node_modules');
  const cache = {};

  const safeOriginalRequire = (str) => {
    const { originalRequire } = __jell__;
    let out;

    try {
      out = originalRequire(str);
    } catch(e) {
      out = undefined;
    }

    return out;
  }

  const packageIsInstalled = (packageName, version) => {
    /* If a version is specified, only check locally */
    let exists = false;
    const localPackageName = path.join(nodeModulesPath, packageName);
    const finalPackageName = version ? localPackageName : packageName;
    const yarnAddCmd = `node -e "require('${finalPackageName}')"`;
    const options = { stdio: 'pipe', cwd: dirname };

    // check cache first
    if (cache[packageName]) return true;

    /* I find it silly, but we create a new process to check for each package.
    The reason is that once node checks for a package, even with resolve, it
    will cache that response. Even clearng require.cache is not good enough.
    So its best to just check in a fresh instance each time :\ */
    try {
      child_process.execSync(yarnAddCmd, options); // this is blocking
      exists = true;
      cache[packageName] = true;
    } catch(e) {
      exists = false;
    }

    return exists;
  }

  const installPackage = (packageName) => {
    const yarnAddCmd = `yarn add ${packageName} --modules-folder ${nodeModulesPath}`;
    const options = { stdio: 'inherit', cwd: dirname };
    child_process.execSync(yarnAddCmd, options); // this is blocking. So js will halt until package becomes available
  };

  const getPackage = (packageName) => {
    const relativePackagePath = path.join(dirname, 'node_modules', packageName);
    
    // if relative or absolute import
    if (/^[./]/.test(packageName)) return safeOriginalRequire(path.join(dirname, packageName));

    // else assume it is a node_module
    return (
      safeOriginalRequire(packageName) || // check global & regular places
      safeOriginalRequire(relativePackagePath) // check the dir of the file executed for node_modules/
    );
  }

  return {
    originalRequire,
    fs,
    path,
    os,
    child_process,
    executable,
    dirname,
    file,

    getPackage,
    safeOriginalRequire,
    packageIsInstalled,
    installPackage,
  }
})();

// --------------------------- monkeypatch require -------------------------- //

require = function(packageStr) {
  const { packageIsInstalled, installPackage, getPackage } = __jell__;
  let [ packageName, version] = packageStr.split('@');

  // install package if it does not exist
  if (packageIsInstalled(packageName, version) === false) installPackage(packageStr);

  // load package. Throw if still undefined
  const pkg = getPackage(packageName);
  if (pkg === undefined) throw Error(`Could not load package ${packageName}. Possibly a download error`);
  return pkg;
}

// ------------------------------- run script ------------------------------- //
eval(__jell__.file);
