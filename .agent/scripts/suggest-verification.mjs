import { collectChanges, readManifests, runCli, selectVerification } from './lib.mjs';

runCli((cwd, base) => {
  const changes = collectChanges(cwd, base);
  return { ...changes, ...selectVerification(changes.paths, readManifests(cwd)) };
});
