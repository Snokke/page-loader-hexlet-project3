#!/usr/bin/env node

import program from 'commander';
import { version, description } from '../../package.json';
import loader from '..';

program
  .version(version)
  .description(description)
  .arguments('<url>')
  .option('-o, --output [type]', 'output folder')
  .action((url) => console.log(loader(url)))
  .parse(process.argv);
