#!/usr/bin/env node
import * as fs from 'fs';
import { createAmmo } from './lib/ammo';
import exampleFile from './lib/exampleFile';
import * as program from 'commander';
import schema from './lib/schema';
program
  .option('-u,--user-agent <agent>', 'UserAgent')
  .option('-f,--file <file>', 'Special format file ')
  .option('-o <out>', 'Out filename')
  .option('-e,--example', 'Create example json file ')
  .parse(process.argv);

let agent: string = 'Yandex-Tank';
if (program.userAgent) {
  agent = program.userAgent;
}

if (program.example) {
  console.log('Print example -> example.json');
  fs.writeFileSync(`${process.env.PWD}/example.json`, JSON.stringify(exampleFile));
  process.exit(0);
}

if (program.file) {
  const file = JSON.parse(
    fs.readFileSync(program.file as string, {
      encoding: 'utf8',
    }),
  );
  const validateRes = schema.validate(file);
  if (validateRes.error) {
    console.error(validateRes.error);
    process.exit(1);
  }
  let tmp = '';
  for (const item of file.data) {
    tmp += createAmmo(item.method.toUpperCase().trim(), file.host, item.path,item.tag, agent, JSON.stringify(item.body),item.headers||{});
  }
  const filename = `${process.env.PWD}/${program.O ? program.O : `${file.host}.txt`}`;
  console.log('Result =====> ', filename);
  fs.writeFileSync(filename, tmp);
  process.exit(0);
}

program.help();
