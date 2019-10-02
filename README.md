## Jell
The Javascript Shell interpreter.

#### What is Jell
Jell is a tool that intends to allow scripting in .sh (shell scripts) with javascript & node. Complexity of scripts easily rise, and Javascript is often a solution. However, with Node and it's NPM use, it can seem innapropriate to npm init a project and manage node_module dependencies for quick turn-key scripts.

Jell aims to solve this problem.

By automating the npm install process the user can focus on what is important: getting work done.

#### How to use
Jell will need to be installed globally. So after the latest Node is installed on the system, simply `npm install --global jell`. After which you will be ready to write your first script!


Sample script:
```
#!jell
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('hello world');
});

console.log('listening on port 3000');
app.listen(3000);
```
