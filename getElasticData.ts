#!/usr/bin/env node
import * as fs from 'fs';
import * as program from 'commander';
import ammoConfJsonShema from './lib/GetDataOfElastic/GetElasticDataShema';
import GetDataOfElastic from './lib/GetDataOfElastic';

program
  .option('-c,--config <config>', 'Config file')
  .option('-o <out>', 'Out filename')
  .parse(process.argv)
  .action(async (cmd, options) => {
    try {
      console.log('exec "%s" using %s mode', cmd, options.exec_mode);
      if (program.config) {
        const file = JSON.parse(
          fs.readFileSync(program.config as string, {
            encoding: 'utf8',
          }),
        );
        const validateRes = ammoConfJsonShema.validate(file);
        if (validateRes.error) {
          console.error(validateRes.error);
          process.exit(1);
        }
        const data = await GetDataOfElastic;
        console.log('conf', file);
        console.log('data', data);
        // console.log(`Результаты сохранены в ${filename}`);
        // console.log(`Колличество запросов === ${responseArr.length}`);
        // fs.writeFileSync(`${process.env.PWD || './'}/${filename}.json`, JSON.stringify(result, null, 2));
        process.exit(0);
      }
      program.help();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });
