import buildDocker from './build-docker';
import buildMeteor from './build-meteor';
import { measuredExec } from './helpers';

export default async function fire({ tags, options }, callback) {
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

  await buildMeteor.bind(this)({ build: process.env.npm_package_config_buildNumber, options: {} });
  await buildDocker.bind(this)({ tags: defaultTags.concat(additionalTags), options: {} });
  if (additionalTags.length > 0) {
    await measuredExec({
      command: `docker push ${additionalTags.join(' ')}`,
      info: 'push image to registry',
      print,
    });
  }
  if (callback) callback();
  return true;
}
