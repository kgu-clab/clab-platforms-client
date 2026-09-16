import { collectChanges, collectEvidence, readManifests, runCli } from './lib.mjs';

runCli((cwd, base) => collectEvidence(cwd, collectChanges(cwd, base), readManifests(cwd)));
