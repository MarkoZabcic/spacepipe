import buildDocker from './build-docker';
import buildMeteor from './build-meteor';

export default async function fire(args, callback) {
  await buildMeteor.bind(this)(args);
  await buildDocker.bind(this)(args);
  if (callback) callback();
  return true;
}
