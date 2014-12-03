#!/usr/bin/env node

"use strict";
var path = require("path");
var baselineTester = require("..");
var packageJson = require("../package.json");

var usage = packageJson.description + "\n\n" + packageJson.name +
            " <main-module> [--exceptions] --cases=<folder> --input=<ext> --output=<ext> [--trim=none]";
var argv = require("yargs")
    .usage(usage, {
        cases: {
            description: "the folder in which your input and output files reside",
            type: "string",
            alias: "c",
            required: true,
            requiresArg: true
        },
        input: {
            description: "the file extension for the input files",
            type: "string",
            alias: "i",
            required: true,
            requiresArg: true
        },
        output: {
            description: "the file extension for the baseline output files",
            type: "string",
            alias: "o",
            required: true,
            requiresArg: true
        },
        trim: {
            description: "whether to trim before comparing; \"none\" or \"both\"",
            type: "string",
            alias: "t",
            requiresArg: true,
            default: "both"
        },
        exceptions: {
            description: "tests for exception messages instead of return values",
            type: "boolean",
            alias: "e"
        }
    })
    .require(1, "Missing required module file argument")
    .addHelpOpt("help")
    .version(packageJson.version, "version")
    .argv;

var func = require(path.resolve(argv._[0]));

baselineTester(func, {
    casesDirectory: argv.cases,
    inputExtension: argv.input,
    outputExtension: argv.output,
    trim: argv.trim,
    checkExceptions: argv.exceptions
});
