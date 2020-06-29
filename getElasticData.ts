#!/usr/bin/env node
import * as fs from 'fs';
import * as program from 'commander';
import ammoConfJsonShema from './lib/GetDataOfElastic/GetElasticDataShema';
import GetDataOfElastic from './lib/GetDataOfElastic';

program
  .option('-c,--config <config>', 'Config file')
  .option('-o <out>', 'Out filename')
  .parse(process.argv);
(async () => {
  try {
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
      const res = await GetDataOfElastic(file);

      console.log(`Результаты сохранены в ${program.O || res.name}`);
      console.log(`Колличество запросов === ${res.data.length}`);
      fs.writeFileSync(`${process.env.PWD || './'}/${program.O || res.name}.json`, JSON.stringify(res, null, 2));
      process.exit(0);
    }
    program.help();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
