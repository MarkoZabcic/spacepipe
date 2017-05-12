import { measuredExec } from './helpers';

export default async function buildDocker({ tags, options }, callback) {
  const print = data => this.log(data);
  const defaultTags = [];
  const additionalTags = [];
  if (process.env.npm_package_name) {
    if (process.env.npm_package_version) {
      defaultTags.push(`${process.env.npm_package_name}:${process.env.npm_package_version}`);
    } else {
      defaultTags.push(`${process.env.npm_package_name}`);
    }
  }
  if (tags && tags.length > 0) {
    tags.forEach(tag => additionalTags.push(tag));
  } else {
    let i = 0;
    while (process.env[`npm_package_config_dockerTags_${i}`]) {
      const tag = process.env[`npm_package_config_dockerTags_${i}`];
      if (!tag) {
        break;
      }
      additionalTags.push(tag);
      i += 1;
    }
  }

  await measuredExec({
    command: `${__dirname}/../scripts/generate-dockerfiles.sh`,
    info: 'build-docker (Generating dockerfiles)',
    print,
  });
  const allTagsString = `"-t ${defaultTags.concat(additionalTags).join(' -t ')}"`;
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
  if (options && options['push-to-registry'] && additionalTags.length > 0) {
    await measuredExec({
      command: `docker push ${additionalTags.join(' ')}`,
      info: 'push image to registry',
      print,
    });
  }

  if (callback) callback();
  return true;
}
