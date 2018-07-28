## Jell
The Javascript Shell scripter.

#### What is Jell
Jell is a tool that intends to replace .sh (shell scripts) with javascript & node. Complexity of scripts easily rise, and Javascript is often a solution. However, with Node and it's NPM use, it can seem innapropriate to npm init a project and manage node_module dependencies for quick turn-key scripts.

Jell aims to solve this problem.

By automating the npm install process, and placing the node_modules folder in the user's home folder, individual directories are kept clean, and the user can focus on what is important: getting work done.

#### How to use
Jell will need to be installed globally. So after the latest Node is installed on the system, simply `npm install --global jell`. After which you will be ready to write your first script!

A script can be a .js file or not. If you do not use the .js extension, other users may not know how to execute the file. The .js tells the user "execute with `node <filename>`". However, you may use a shebang to inform the interpreter to use node when executing this file. A shebang at the begining of the script looks like this:

`#!/usr/bin/env node`

env is a application that will find node on the system and use that node. The remainder of the file will be launched with node. Now you can name the file `script.sh` and make it executable with `chmod +x script.sh`.

###### Require node modules
The use of require has changed for convenience. Albiet not as simple, the tradeoff is convenience of not having to manage node_modules.

Every Jell script must start with the same line: `const $ = require('jell');` (or a variation of requiring jell). Once Jell is imported into a variable name of your coosing (such as $), no longer shall you use the standard require, but instead use $.require (or it's alias $.include). This is a new require mechanism that will import modules from a hidden directory and download modules if they are not already downloaded.

Sample script:
```
#!/usr/bin/env node
const $ = require('jell');
const express = $.require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('hello world');
});

console.log('listening on port 3000');
app.listen(3000);
```

#### Features
The Jell object, when assigned to a variable, includes the new `require/include` methods, as well as the `fs` and `shelljs` node modules in scope. This means that instead of having to require fs or shelljs, you can simple use $ as a drop-in replacement.

old
```
const fs = requre('fs');
fs.readFileSync(...)
```
new
`$.readFileSync(...)`

Be sure to check out https://www.npmjs.com/package/shelljs for a list of all methods as well as https://nodejs.org/api/fs.html
