import buildDocker from './build-docker';
import buildMeteor from './build-meteor';

export default async function fire({ options }, callback) {
  await buildMeteor.bind(this)();
  await buildDocker.bind(this)();
  if (callback) callback();
  return true;
}
