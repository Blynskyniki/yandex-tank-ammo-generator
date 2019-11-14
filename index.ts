#!/usr/bin/env node
import * as fs from 'fs';
import * as url from 'url';
import { createAmmo } from './lib/ammo';
import exampleFile from './lib/exampleFile';
const Joi = require('@hapi/joi');
const program = require('commander');
const schema = Joi.object({
  name: Joi.string().required(),
  host: Joi.string().required(),
  data: Joi.array().items(
    Joi.object({
      method: Joi.string().required(),
      body: [Joi.string().optional(), Joi.allow(null)],
      path: Joi.string().required(),
    }),
  ),
});
program
  .option('-u,--user-agent <agent>', 'UserAgent')
  .option('-f,--file <file>', 'Special format file ')
  .option('-o <out>', 'Out filename')

  .option('-e,--example', 'Create example special format file ')
  .parse(process.argv);

let agent: string = 'Yandex-Tank-Dev';
if (program.agent) {
  agent = program.agent;
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
    tmp += createAmmo(item.method.toUpperCase().trim(), file.host, item.path, agent, JSON.stringify(item.body));
  }
  const filename = `${process.env.PWD}/${program.O ? program.O : file.host}`;

  fs.writeFileSync(filename, tmp);
  console.log('File', file);
  console.log('Result', filename);
  process.exit(0);
}
console.log('Bad arguments');
process.exit(1);
