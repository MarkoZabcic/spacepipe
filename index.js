import Vorpal from 'vorpal';
import fs from 'fs';
import rc from 'vorpal-rc';
import updateVersionInfo from './src/update-version-info';
import buildMeteor from './src/build-meteor';
import buildDocker from './src/build-docker';
import fire from './src/fire';

const vorpal = new Vorpal();
const RC_PATH = './spacepiperc';

vorpal
  .command('update-version', 'Generate new version.json file out of GIT, package.json and CI environment variables')
  .action(updateVersionInfo);

vorpal
  .command('build-meteor', 'Test & build meteor application')
  .option('-f, --fast', 'ignore tests')
  .option('-k, --keep-version', 'no version.json update')
  .action(buildMeteor);

vorpal
  .command('build-docker', 'Wrap the built app into a production docker image')
  .option('-l, --local-engine', 'Local build (usually slower, requires local docker engine installation like docker toolbox)')
  .action(buildDocker);

vorpal
  .command('fire', 'Test & build meteor application, build docker image & push to registry')
  .action(fire);

if (fs.existsSync(RC_PATH)) {
  vorpal.use(rc, RC_PATH);
}

vorpal
  // .delimiter('spacepipe>')
  // .show();
  .parse(process.argv);
