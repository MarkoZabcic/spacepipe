import { exec } from 'child_process';
import Promise from 'promise';
import path from 'path';
import moment from 'moment';
import fs from 'fs';

const VERSION_FILE = 'private/version.json';

function getBranch() {
  return new Promise((fulfill, reject) => {
    exec(
            "git branch | grep '*'",
            (err, stdout) => {
              if (err)reject(err);
              const name = stdout.replace('* ', '').replace('\n', '');
              fulfill(name);
            },
        );
  });
}

function getCommit() {
  return new Promise((fulfill, reject) => {
    exec(
            'git rev-parse HEAD',
            (err, stdout) => {
              if (err)reject(err);
              const commitName = stdout.replace('* ', '').replace('\n', '');
              fulfill(commitName);
            },
        );
  });
}

export default async function updateVersionInfo(args, callback) {
  const result = {
    timestamp: moment().format('DD-MM-YYYY HH:mm'),
  };
  const currentDirectory = process.cwd();
  return getBranch()
      .then((_branch) => {
        result.branch = _branch;
      })
      .then(getCommit)
      .then((_commit) => {
        result.commit = _commit;
      })
      .then(() => {
        const packageContent = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
        result.build = process.env.npm_package_config_buildNumber;
        result.version = packageContent.version;
        const fileContent = JSON.stringify(result, null, 2);
        const pathToFile = path.normalize(`${currentDirectory}/${VERSION_FILE}`);
        this.log(fileContent);
        this.log(`path: ${pathToFile}`);
        fs.writeFileSync(pathToFile, fileContent);
        callback();
      });
}
