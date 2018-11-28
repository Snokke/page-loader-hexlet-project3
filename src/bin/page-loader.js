#!/usr/bin/env node

import program from 'commander';
import { version, description } from '../../package.json';
import loader from '..';

program
  .version(version)
  .description(description)
  .arguments('<url>')
  .option('-o, --output [folder]', 'output folder')
  .action(requestUrl => loader(requestUrl, program.output))
  .parse(process.argv);
