rasta
=====

Give ``rasta`` a folder of markdown files with yaml headers and you'll get back markdown with accompanying metadeta. 

Uses [meta-marked](https://github.com/j201/meta-marked).

(Originally, I intended to make this module generate a team roster and individual bio pages. Hence the name.)

### Add the module to your site

```
npm install rasta
```

### Use files like  markdown + yaml:

Just include a simple section of yaml at the header of each bio, fenced in with three dashes above and three dots below. 

Whatever associated content you'd like associated with that metadata goes below that.

Like so:

```
---
name: Andrew Ryan
title: Chief Bio Officer
slug: andy
image: /images/andy.png
...

Here's my cool content!
```

### Then you can do some stuff like this:

```
var Rasta = require('rasta');

var rasta = new Rasta(__dirname + '/team');

var allTheThings = rasta.all();

console.log(allTheThings);

var justOneOfTheThings = rasta.getBySlug('some-url-slug');

console.log(justOneOfTheThings);

```

### Maybe you'd like an example?
Then check out the [example](https://github.com/adambrault/rasta/tree/master/example)!


### That's it!
And that's it! *Now you're cooking with rasta!*

(I don't think that's a thing though.)