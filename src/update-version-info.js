import { execAsync } from 'async-child-process';
import { readFile, writeFile } from 'async-file';
import path from 'path';
import moment from 'moment';

const VERSION_FILE = 'private/version.json';
const BUILD_NUMBER = process.env.npm_package_config_buildNumber;

async function getBranch() {
  const { stdout } = await execAsync("git branch | grep '*'");
  return stdout.replace('* ', '').replace('\n', '');
}

async function getCommit() {
  const { stdout } = await execAsync('git rev-parse HEAD');
  return stdout.replace('* ', '').replace('\n', '');
}

export default async function updateVersionInfo(args, callback) {
  const currentDirectory = process.cwd();
  const { version } = JSON.parse(await readFile('package.json', 'utf-8'));

  const result = {
    timestamp: moment().format('DD-MM-YYYY HH:mm'),
    branch: await getBranch(),
    commit: await getCommit(),
    build: BUILD_NUMBER,
    version,
  };

  const fileContent = `${JSON.stringify(result, null, 2)}\n`;
  const pathToFile = path.normalize(`${currentDirectory}/${VERSION_FILE}`);
  this.log(`>(spacepipe)>: Updating version file (${pathToFile})\n${fileContent}`);
  await writeFile(pathToFile, fileContent);
  if (callback) callback();
  return true;
}
