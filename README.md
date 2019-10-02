## Jell
The Javascript Shell interpreter.

#### What is Jell
Jell is a tool that allows you to write script files in javascript by creating a shebang. Simply specify `#!jell` at the top of a file.

###### Can't node be used as a shebang?
Yes! And in some instances this is great. However, if you plan to use any modules from the NPM repository, you best make sure your script users initialize the directory with `npm install` or `yarn install`. What a bummer right?

With Jell, all dependency requirements are handled for you. Javascript/node files are now less like projects and more like drop-in scripts where the user doesn't need to know anything.

#### Why did you invent this?
I write scripts often, but no matter how long I work with .sh files, I really dislike the language. Python is great, but I natively think in Javascript due to my dayjob. I thought it would be great if I could create a shebang that allowed me to write scripts and share them with others to run. My demographic of people who would run these files would probably not be versed node development and would need to be handed a single file to solve their problems.

#### How to use
Jell should be installed globally to be really useful. So after the peferred NodeJS version is installed on the system, simply `yarn install global jell`. Now you are ready to use `jell filename.ext` or the shebang `#!jell`!

_Note: Some pefer to use `#!/usr/bin/env jell` to resolve possible relative paths._

#### Requirements
Jell requires `yarn` to be installed as well as NodeJS. It may change in the future to support npm, but since the landscape of node is changing, this support may not come unless significant interest or reasons arrise.

#### Usage
Jell modifies the `require` statement in nodeJS. We perform extra work to execute `yarn add` on your behalf and install it in the same directory as the script. There are some rules however:

1. NodeJS checks for the module in it's usual locations first (see nodejs docs).
2. If the package is global, it will use that
3. If the package is relative or absolute, the behavior is as normal
4. If a version is specified, Jell will check the local directory for the package

The only main difference is that you can now specify the desired version in the require statement. This will force Jell to look for the package locally (and not globally) and will help in cases of code breakage.

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

#### Install on a clean system
If you want to install NodeJS, Yarn and Jell so that scripting can be easily done, we have provided a script for that. Simply execute the following command to run a script that installs all the prerequisites and Jell. The service https://statically.io/ is used to serve this script from github.

