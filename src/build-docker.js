import { measuredExec } from './helpers';

export default async function buildDocker({ tags, options }, callback) {
  const print = data => this.log(data);
  await measuredExec({
    command: `${__dirname}/../scripts/generate-dockerfiles.sh`,
    info: 'build-docker (Generating dockerfiles)',
    print,
  });
  const allTagsString = `"-t ${tags.join(' -t ')}"`;
  if (!options || !options['local-engine']) {
    await measuredExec({
      command: `${__dirname}/../scripts/build_in_siblings.sh ${allTagsString}`,
      info: 'build-docker (Build image in sibling mode)',
      print,
    });
  } else {
    await measuredExec({
      command: `${__dirname}/../scripts/build_local.sh ${allTagsString}`,
      info: 'build-docker (Build image in local mode)',
      print,
    });
  }
  if (callback) callback();
  return true;
}
