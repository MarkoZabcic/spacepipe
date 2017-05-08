import Vorpal from 'vorpal';
import fs from 'fs';
import rc from 'vorpal-rc';
import updateVersionInfo from './src/update-version-info';

const vorpal = new Vorpal();
const RC_PATH = './spacepiperc';

vorpal
  .command('update-version')
  .action(updateVersionInfo);

if (fs.existsSync(RC_PATH)) {
  vorpal.use(rc, RC_PATH);
}

vorpal
  // .delimiter('spacepipe>')
  // .show();
  .parse(process.argv);
