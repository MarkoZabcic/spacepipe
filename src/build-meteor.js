import updateVersionInfo from './update-version-info';
import { measuredExec } from './helpers';

export default async function buildMeteor({ options }, callback) {
  const print = data => this.log(data);
  await measuredExec({
    command: 'meteor npm install',
    info: 'build-meteor step (install npm dependencies)',
    print,
  });

  if (!options || !options.fast) {
    await measuredExec({
      command: 'meteor npm run test',
      info: 'build-meteor step (test)',
      print,
    });
  }
  if (!options || !options['keep-version']) {
    await updateVersionInfo.bind(this)();
  }
  await measuredExec({
    command: 'meteor npm run meteorbuild',
    info: 'build-meteor step (build)',
    print,
  });
  if (callback) callback();
  return true;
}
