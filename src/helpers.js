import { exec } from 'child_process';
import { join } from 'async-child-process';
import moment from 'moment';

export async function measuredExec({ info, command, print }) {
  const start = moment();
  print(`>(spacepipe)>: Starting ${info} (running command: ${command})`);
  const npmStream = exec(command);
  if (process.env.DEBUG) {
    npmStream.stdout.on('data', print);
  }
  npmStream.stderr.on('data', print);
  await join(npmStream);
  const end = moment();
  const seconds = end.diff(start, 'seconds');
  print(`>(spacepipe)>: Finished ${info} (duration: ${seconds} seconds)`);
}

export async function wrappedCommand(command, args) {
  return new Promise((resolve, reject) => {
    command(args, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}
