import { checkDiffHygiene, collectChanges, runCli } from './lib.mjs';

runCli((cwd, base) => checkDiffHygiene(cwd, collectChanges(cwd, base)));
