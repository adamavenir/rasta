rasta
=====

Generate a team roster from a provided folder of markdown files and images.

Uses simple markdown + yaml text files.

### Add the module to your site

```
npm install rasta
```
var express = require('express');
var Rasta = require('rasta');

var app = express();

var bioDir = ('./bios')

var rasta = new Rasta(app, bioDir);

app.listen(3000);

console.log("port 3000's so rasta, man")

```

Check out the [example](https://github.com/adambrault/rasta/tree/master/example) for some simple default templates.

## Adding your bios:

Just include a simple section of yaml at the header of each bio, fenced in with three dashes and using these keys:

```
---
name: Andrew Ryan
title: Chief Bio Officer
slug: andy
image: /images/andy.png
---
```

Double-check that your image uris and paths are properly configured.