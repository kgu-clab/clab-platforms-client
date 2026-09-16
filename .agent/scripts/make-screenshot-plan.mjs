import { collectChanges, runCli, screenshotPlan } from './lib.mjs';

runCli((cwd, base) => screenshotPlan(cwd, collectChanges(cwd, base)));
