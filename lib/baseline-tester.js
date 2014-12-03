"use strict";
var assert = require("assert");
var fs = require("fs");
var path = require("path");
var glob = require("glob");
var Mocha = require("mocha");

module.exports = function (func, options, callback) {
    var mocha = new Mocha();

    if (options.inputExtension[0] === ".") {
        options.inputExtension = options.inputExtension.substring(1);
    }
    if (options.outputExtension[0] === ".") {
        options.outputExtension = options.outputExtension.substring(1);
    }

    glob.sync(path.resolve(options.casesDirectory, "*." + options.inputExtension)).forEach(function (inputFilePath) {
        var inputFileName = path.basename(inputFilePath);
        var outputFileName = path.basename(inputFilePath, "." + options.inputExtension) + "." + options.outputExtension;
        var outputFilePath = path.resolve(options.casesDirectory, outputFileName);

        var inputContents = fs.readFileSync(inputFilePath, { encoding: "utf-8" });
        var outputContents = fs.readFileSync(outputFilePath, { encoding: "utf-8" });

        if (options.trim === undefined || options.trim === "both") {
            inputContents = inputContents.trim();
            outputContents = outputContents.trim();
        }

        var test = new Mocha.Test(inputFileName, function () {
            if (options.checkExceptions) {
                assert.throws(
                    function () {
                        func(inputContents)
                    },
                    function (er) {
                        assert.ok(typeof er === "object" && er !== null, "Error was not an object.");
                        assert.ok("message" in er, "Error did not have a message property.");
                        assert.strictEqual(er.message, outputContents);
                        return true;
                    }
                );
            } else {
                assert.strictEqual(func(inputContents), outputContents);
            }
        });

        mocha.suite.addTest(test);
    });

    mocha.run(callback);
};
