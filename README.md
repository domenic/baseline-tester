# Test a function against baseline output

Let's say you're writing a function that transforms some text into some other text. This package makes testing such a function easy, by letting you set up source files alongside their corresponding desired baseline output files, and then seeing if your function generates the right results.

## Example

Let's say you're writing a Markdown-to-HTML converter, and have set up your project like so:

```
lib/
  md2html.js
test/
  cases/
    bold.md
    bold.html
    paragraphs.md
    paragraphs.html
    ⋮
```

Here we assume `lib/md2html.js` has a default export that is a function converting strings of Markdown to strings of HTML, synchronously.

To run the tests using baseline-tester, you can either use the CLI:

```
$ baseline-tester lib/md2html.js --cases test/cases --input md --output html
```

or you can do so programmatically (say, from `test/runner.js`):

```js
"use strict";
var path = require("path");
var baselineTester = require("baseline-tester");
var md2html = require("../lib/md2html.js");

baselineTester(md2html, {
    casesDirectory: path.resolve(__dirname, "cases"),
    inputExtension: "md",
    outputExtension: "html"
});
```

## Trimming

It's common to want to ignore leading or trailing whitespace when comparing against the baseline files. baseline-tester will do this by default, but you can turn it off by specifying `--trim=none` on the command line or `trim: "none"` programmatically.

## Testing Exceptions

If you want to test that your function throws certain exceptions, you can use a slightly modified setup. On the command line, pass the additional option `--exceptions`; when used programmatically, pass the additional option `checkExceptions: true`.

For example, if you stored your exceptional cases under `test/exceptions` with the exception messages being given extension `.txt`, you could do

```
$ baseline-tester lib/md2html.js --exceptions --cases test/exceptions --input md --output txt
```

Exception messages are checked against the message: i.e., are the contents of the "output" file equal to the exception's `message` property (modulo potential trimming).
