#!/usr/bin/env node
import * as fs from 'fs';
import * as program from 'commander';
import { createAmmo } from './lib/AmmoGenerator/ammo';
import ammoConfJsonShema from './lib/GetDataOfElastic/GetElasticDataShema';
import GetDataOfElastic from './lib/GetDataOfElastic';

program
  .option('-u,--user-agent <agent>', 'UserAgent')
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
      let agent: string = 'Yandex-Tank';
      if (program.userAgent) {
        agent = program.userAgent;
      }
      let tmp = '';
      for (const item of res.data) {
        tmp += createAmmo(
          item.method.toUpperCase().trim(),
          file.host,
          item.path,
          item.tag,
          agent,
          JSON.stringify(item.body),
          item.headers || {},
        );
      }

      console.log(`Результаты сохранены в ${program.O || res.name}`);
      console.log(`Колличество запросов === ${res.data.length}`);
      fs.writeFileSync(`${process.env.PWD || './'}/${program.O || res.name}.txt`, tmp);
      process.exit(0);
    }
    program.help();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
