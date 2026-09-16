import { checkLocalFiles, collectChanges, runCli } from './lib.mjs';

runCli((cwd, base) => checkLocalFiles(cwd, collectChanges(cwd, base)));
