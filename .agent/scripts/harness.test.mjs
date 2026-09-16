import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  checkDiffHygiene,
  checkLocalFiles,
  collectChanges,
  collectEvidence,
  git,
  initLocal,
  parseBase,
  planScreenshots,
  readManifests,
  resolveBase,
  selectVerification,
  shellQuote,
  splitPaths,
  suspiciousPaths,
  textHygiene,
} from './lib.mjs';

// Only the test process: fixture Git must not read personal config, sign or invoke hooks.
for (const key of Object.keys(process.env)) {
  if (key.startsWith('GIT_')) delete process.env[key];
}
Object.assign(process.env, {
  GIT_CONFIG_NOSYSTEM: '1',
  GIT_CONFIG_GLOBAL: '/dev/null',
  GIT_AUTHOR_NAME: 'Harness Test',
  GIT_AUTHOR_EMAIL: 'harness@example.invalid',
  GIT_COMMITTER_NAME: 'Harness Test',
  GIT_COMMITTER_EMAIL: 'harness@example.invalid',
  GIT_AUTHOR_DATE: '2026-01-01T00:00:00Z',
  GIT_COMMITTER_DATE: '2026-01-01T00:00:00Z',
});

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const manifests = readManifests(repoRoot);

function put(cwd, path, text = 'content\n') {
  mkdirSync(dirname(join(cwd, path)), { recursive: true });
  writeFileSync(join(cwd, path), text);
}

function putManifests(cwd) {
  for (const [path, manifest] of Object.entries(manifests)) {
    put(cwd, path ? `${path}/package.json` : 'package.json', JSON.stringify(manifest));
  }
}

function cli(cwd, helper, ...args) {
  return spawnSync(process.execPath, [join(repoRoot, `.agent/scripts/${helper}.mjs`), ...args], {
    cwd,
    encoding: 'utf8',
  });
}

function fixture(t, ignored = true) {
  const cwd = mkdtempSync(join(tmpdir(), 'clab-harness-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  git(cwd, ['init', '--initial-branch=main']);
  git(cwd, ['config', 'core.hooksPath', '/dev/null']);
  git(cwd, ['config', 'commit.gpgsign', 'false']);
  git(cwd, ['config', 'core.autocrlf', 'false']);
  put(cwd, '.gitignore', ignored ? '.agent-local/\n.env*\n' : '');
  put(cwd, 'README.md');
  put(cwd, 'rename me.ts');
  git(cwd, ['add', '--all']);
  git(cwd, ['commit', '-m', 'fixture base']);
  git(cwd, ['checkout', '-b', 'feature/51']);
  return cwd;
}

test('collects branch, staged, unstaged, untracked and both sides of a rename without shell parsing', (t) => {
  const cwd = fixture(t);
  const unusual = 'apps/member/src/space \' " $(touch NEVER)\nfile.ts';
  put(cwd, 'apps/land/app/apply/page.tsx');
  git(cwd, ['add', '--all']);
  git(cwd, ['commit', '-m', 'fixture branch change']);
  git(cwd, ['mv', '--', 'rename me.ts', 'renamed file.ts']);
  put(cwd, unusual);
  git(cwd, ['add', '--', unusual]);
  put(cwd, 'README.md', 'unstaged\n');
  put(cwd, 'packages/config/new file.css');
  const result = collectChanges(cwd);
  assert.equal(result.base.ref, 'main');
  assert.deepEqual(result.sources.branch, ['apps/land/app/apply/page.tsx']);
  assert.deepEqual(result.sources.staged, [unusual, 'rename me.ts', 'renamed file.ts']);
  assert.deepEqual(result.sources.unstaged, ['README.md']);
  assert.deepEqual(result.sources.untracked, ['packages/config/new file.css']);
  assert.equal(result.paths.length, 6);
  assert.equal(existsSync(join(cwd, 'NEVER')), false);
  assert.deepEqual(splitPaths('a\nb\0c d\0'), ['a\nb', 'c d']);
});

test('retains staged and unstaged changes even when the net HEAD diff cancels', (t) => {
  const cwd = fixture(t);
  put(cwd, 'README.md', 'staged\n');
  git(cwd, ['add', '--', 'README.md']);
  put(cwd, 'README.md');
  const result = collectChanges(cwd);
  assert.deepEqual(result.sources.staged, ['README.md']);
  assert.deepEqual(result.sources.unstaged, ['README.md']);
  assert.deepEqual(result.paths, ['README.md']);
});

test('resolves explicit base, origin HEAD, remote fallback and local fallback in order', (t) => {
  const cwd = fixture(t);
  const initial = git(cwd, ['rev-parse', 'HEAD']).stdout.trim();
  assert.equal(resolveBase(cwd).ref, 'main');
  git(cwd, ['update-ref', 'refs/remotes/origin/main', initial]);
  assert.equal(resolveBase(cwd).ref, 'origin/main');
  git(cwd, ['update-ref', 'refs/remotes/origin/develop', initial]);
  git(cwd, ['symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/develop']);
  assert.equal(resolveBase(cwd).ref, 'origin/develop');
  assert.equal(resolveBase(cwd, 'main').ref, 'main');
  assert.throws(() => resolveBase(cwd, 'missing'), /Explicit base/);
  assert.throws(() => resolveBase(cwd, '$(touch NEVER)'), /Explicit base/);
  assert.equal(existsSync(join(cwd, 'NEVER')), false);
});

test('uses merge-base for diverged histories and never substitutes an arbitrary prior commit', (t) => {
  const cwd = fixture(t);
  const initial = git(cwd, ['rev-parse', 'HEAD']).stdout.trim();
  put(cwd, 'feature.txt');
  git(cwd, ['add', '--all']);
  git(cwd, ['commit', '-m', 'feature']);
  git(cwd, ['checkout', 'main']);
  put(cwd, 'base-only.txt');
  git(cwd, ['add', '--all']);
  git(cwd, ['commit', '-m', 'base advanced']);
  git(cwd, ['checkout', 'feature/51']);
  const result = collectChanges(cwd);
  assert.equal(result.base.mergeBase, initial);
  assert.deepEqual(result.sources.branch, ['feature.txt']);
  git(cwd, ['branch', '-D', 'main']);
  const unknown = collectChanges(cwd);
  assert.equal(unknown.base.ref, null);
  assert.match(unknown.base.warning, /not included/);
  assert.deepEqual(unknown.sources.branch, []);
});

test('handles a one-commit checkout and an unborn repository without guessing a base', (t) => {
  const cwd = fixture(t);
  git(cwd, ['checkout', 'main']);
  assert.equal(resolveBase(cwd).ref, null);
  assert.deepEqual(collectChanges(cwd).paths, []);
  git(cwd, ['checkout', '--orphan', 'unborn']);
  assert.equal(resolveBase(cwd).mergeBase, null);
  assert.ok(collectChanges(cwd).sources.staged.includes('README.md'));
});

test('init refuses to write before ignore, preserves existing artifacts and rejects tracked local files', (t) => {
  const cwd = fixture(t, false);
  assert.throws(() => initLocal(cwd), /must be ignored/);
  assert.equal(existsSync(join(cwd, '.agent-local')), false);
  put(cwd, '.gitignore', '.agent-local/\n');
  initLocal(cwd);
  put(cwd, '.agent-local/README.md', 'keep this\n');
  put(cwd, '.agent-local/task-cards/51.md', 'keep card\n');
  initLocal(cwd);
  assert.equal(readFileSync(join(cwd, '.agent-local/README.md'), 'utf8'), 'keep this\n');
  assert.equal(readFileSync(join(cwd, '.agent-local/task-cards/51.md'), 'utf8'), 'keep card\n');
  assert.deepEqual(collectChanges(cwd).sources.untracked, []);
  git(cwd, ['add', '--force', '--', '.agent-local/task-cards/51.md']);
  assert.throws(() => initLocal(cwd), /tracked files/);
});

test('init checks nested ignore exceptions and rejects redirected destinations', (t) => {
  const cwd = fixture(t);
  put(cwd, '.gitignore', '.agent-local/**/probe.tmp\n.agent-local/README.md\n');
  assert.throws(() => initLocal(cwd), /must be ignored/);
  assert.equal(existsSync(join(cwd, '.agent-local')), false);
  put(cwd, '.gitignore', '.agent-local/*\n!.agent-local/worklogs/\n');
  assert.throws(() => initLocal(cwd), /must be ignored/);
  assert.equal(existsSync(join(cwd, '.agent-local')), false);
  put(cwd, '.gitignore', '.agent-local/\n');
  mkdirSync(join(cwd, '.agent-local'));
  mkdirSync(join(cwd, 'outside'));
  symlinkSync(join(cwd, 'outside'), join(cwd, '.agent-local/worklogs'), 'dir');
  assert.throws(() => initLocal(cwd), /symlinks/);
  assert.equal(existsSync(join(cwd, '.agent-local/task-cards')), false);
});

test('flags local, environment and credential paths without matching ordinary names', () => {
  const unsafe = [
    '.agent-local/card.md',
    'apps/member/.env',
    '.env.example',
    '.env.staging',
    '.env-local',
    '.env_backup',
    '.envrc',
    '.direnv/private',
    'x/node_modules/a',
    'x/.next/a',
    'key.pem',
    '.npmrc',
  ];
  assert.deepEqual(
    suspiciousPaths([...unsafe, 'environment.ts', 'env.d.ts', '.envoy.yml', 'localization.ts']),
    [...unsafe].sort()
  );
});

test('checks tracked env files outside the diff and does not print env values', (t) => {
  const cwd = fixture(t);
  const secret = 'SENTINEL_VALUE_SHOULD_NEVER_APPEAR';
  put(cwd, '.env.staging', `EXAMPLE=${secret} \n`);
  git(cwd, ['add', '--force', '--', '.env.staging']);
  git(cwd, ['commit', '-m', 'fixture env']);
  const result = checkLocalFiles(cwd, collectChanges(cwd, 'HEAD'));
  assert.deepEqual(result.suspicious, ['.env.staging']);
  assert.equal(result.ok, false);
  assert.equal(collectEvidence(cwd, collectChanges(cwd, 'HEAD'), manifests).ok, false);
  put(cwd, '.env.staging', `EXAMPLE=${secret}  \n`);
  const cli = spawnSync(
    process.execPath,
    [join(repoRoot, '.agent/scripts/check-diff-hygiene.mjs')],
    {
      cwd,
      encoding: 'utf8',
    }
  );
  assert.equal(cli.status, 1);
  assert.equal(`${cli.stdout}${cli.stderr}`.includes(secret), false);
});

test('existing shared root env template and registry config are exempt only while unchanged', (t) => {
  const cwd = fixture(t);
  put(cwd, '.env.example', 'EXAMPLE=\n');
  put(cwd, '.npmrc', 'auto-install-peers=true\n');
  git(cwd, ['add', '--force', '--', '.env.example', '.npmrc']);
  git(cwd, ['commit', '-m', 'fixture shared config']);
  assert.equal(checkLocalFiles(cwd, collectChanges(cwd, 'HEAD')).ok, true);
  assert.deepEqual(checkLocalFiles(cwd, collectChanges(cwd)).suspicious, [
    '.env.example',
    '.npmrc',
  ]);
  put(cwd, '.env.example', 'CHANGED=\n');
  put(cwd, '.npmrc', 'auto-install-peers=false\n');
  assert.deepEqual(checkLocalFiles(cwd, collectChanges(cwd, 'HEAD')).suspicious, [
    '.env.example',
    '.npmrc',
  ]);
});

test('diff hygiene checks committed, staged, unstaged and untracked whitespace without echoing lines', (t) => {
  const cwd = fixture(t);
  const sentinel = 'HYGIENE_CONTENT_MUST_NOT_APPEAR';
  put(cwd, 'branch.md', `${sentinel} \n`);
  git(cwd, ['add', '--all']);
  git(cwd, ['commit', '-m', 'fixture whitespace']);
  put(cwd, 'staged.md', 'bad \n');
  const unusual = ':(glob)space \nfile.md';
  put(cwd, unusual, `${sentinel} \n`);
  put(cwd, 'clean.md', 'clean\n');
  git(cwd, ['--literal-pathspecs', 'add', '--', 'staged.md', unusual, 'clean.md']);
  put(cwd, 'README.md', 'bad \n');
  put(cwd, 'new.md', 'bad \n');
  const result = checkDiffHygiene(cwd, collectChanges(cwd));
  assert.equal(result.ok, false);
  assert.deepEqual(result.failedLayers, [
    { layer: 'staged', paths: [unusual, 'staged.md'] },
    { layer: 'unstaged', paths: ['README.md'] },
    { layer: 'branch', paths: ['branch.md'] },
  ]);
  assert.deepEqual(result.untrackedIssues, [{ path: 'new.md', lines: [1] }]);
  assert.match(result.branchNote, /merged history/);
  const output = cli(cwd, 'check-diff-hygiene');
  assert.equal(output.status, 1);
  assert.deepEqual(JSON.parse(output.stdout).failedLayers, result.failedLayers);
  assert.equal(`${output.stdout}${output.stderr}`.includes(sentinel), false);
  assert.deepEqual(textHygiene('clean\r\n'), []);
  assert.deepEqual(textHygiene('binary\0 \n'), []);
  assert.deepEqual(textHygiene('<<<<<<< branch\n'), [1]);
});

test('manifest read and parse failures identify only the operation and expected relative path', (t) => {
  const cwd = fixture(t);
  const sentinel = 'MANIFEST_CONTENT_MUST_NOT_APPEAR';
  for (const path of Object.keys(manifests)) {
    const manifestPath = path ? `${path}/package.json` : 'package.json';
    for (const operation of ['read', 'parse manifest JSON']) {
      putManifests(cwd);
      if (operation === 'read') rmSync(join(cwd, manifestPath));
      else put(cwd, manifestPath, `{"private":"${sentinel}" invalid JSON`);
      for (const helper of ['collect-pr-evidence', 'suggest-verification']) {
        const output = cli(cwd, helper);
        assert.equal(output.status, 1);
        assert.equal(output.stdout, '');
        assert.deepEqual(JSON.parse(output.stderr), {
          error: `Unable to ${operation === 'read' ? 'read manifest' : operation}: ${manifestPath}.`,
        });
        assert.equal(output.stderr.includes(sentinel), false);
        assert.equal(output.stderr.includes(cwd), false);
      }
    }
  }
});

test('verification maps each package to supported scripts and config/shared changes to consumers', () => {
  const land = selectVerification(['apps/land/app/page.tsx'], manifests);
  assert.deepEqual(land.targeted, [
    "pnpm --filter '@clab/land' lint",
    "pnpm --filter '@clab/land' build",
  ]);
  assert.deepEqual(selectVerification(['apps/member/src/app/main.tsx'], manifests).targeted, [
    "pnpm --filter '@clab/member' lint",
    "pnpm --filter '@clab/member' build",
  ]);
  for (const path of [
    'packages/design-system/src/index.ts',
    'packages/config/theme.css',
    'pnpm-lock.yaml',
  ]) {
    const result = selectVerification([path], manifests);
    assert.equal(result.targeted.length, 5);
    assert.ok(result.targeted.includes("pnpm --filter '@clab/design-system' build"));
    assert.ok(result.targeted.every((cmd) => !/test|typecheck|@clab\/config/.test(cmd)));
  }
  const harness = selectVerification(['.agent/scripts/lib.mjs', 'AGENTS.md'], manifests);
  assert.deepEqual(harness.targeted, []);
  assert.deepEqual(harness.harness, ['pnpm agent:test', 'pnpm agent:check']);
  assert.deepEqual(harness.baseline, ['pnpm lint', 'pnpm build']);
  assert.deepEqual(selectVerification([], manifests).baseline, []);
  const noScripts = Object.fromEntries(
    Object.keys(manifests).map((path) => [path, { scripts: {} }])
  );
  assert.deepEqual(selectVerification(['apps/land/app/page.tsx'], noScripts).targeted, []);
  assert.deepEqual(selectVerification(['AGENTS.md'], noScripts).harness, []);
});

test('screenshot plans require an extant changed page; other UI changes never fabricate routes', () => {
  for (const paths of [
    [],
    ['AGENTS.md'],
    ['apps/member/src/pages/home/HomePage.tsx'],
    ['apps/member/src/app/route/config.tsx'],
    ['packages/config/theme.css'],
    ['packages/design-system/src/components/button/Button.tsx'],
    ['apps/land/app/layout.tsx'],
  ]) {
    assert.deepEqual(planScreenshots(paths, paths).targets, []);
  }
  assert.deepEqual(planScreenshots(['apps/land/app/page.tsx'], []).targets, []);
  const files = ['apps/land/app/page.tsx', 'apps/land/app/(public)/apply/[id]/page.tsx'];
  const result = planScreenshots(files, files);
  assert.deepEqual(
    result.targets.map(({ route, dynamic }) => ({ route, dynamic })),
    [
      { route: '/apply/[id]', dynamic: true },
      { route: '/', dynamic: false },
    ]
  );
  const unsupported = ['apps/land/app/@modal/(.)apply/page.tsx', 'apps/land/app/_private/page.tsx'];
  assert.deepEqual(planScreenshots(unsupported, unsupported).targets, []);
});

test('screenshot inspection is limited to plausible UI surfaces', () => {
  const nonUi = [
    'package.json',
    'apps/land/package.json',
    'apps/member/package.json',
    'packages/design-system/package.json',
    'apps/member/src/api/member.ts',
    'apps/member/src/api/config/index.ts',
    'apps/member/src/api/example.tsx',
    'apps/member/src/api/fixture.css',
    'apps/land/lib/axios.ts',
    'apps/land/types/apply.ts',
    'packages/config/eslint/base.js',
    'apps/member/tsconfig.json',
  ];
  assert.deepEqual(planScreenshots(nonUi, nonUi).needsInspection, []);
  assert.deepEqual(planScreenshots(nonUi, nonUi).targets, []);
  const ui = [
    'apps/member/src/pages/home/HomePage.tsx',
    'apps/member/src/app/route/config.tsx',
    'apps/land/app/layout.tsx',
    'apps/land/components/Header.tsx',
    'packages/design-system/src/components/button/Button.stories.tsx',
    'packages/config/theme.css',
  ];
  const result = planScreenshots([...nonUi, ...ui], [...nonUi, ...ui]);
  assert.deepEqual(result.needsInspection, [...ui].sort());
  assert.deepEqual(result.targets, []);
});

test('PR evidence includes working changes and marks verification as uncollected', (t) => {
  const cwd = fixture(t);
  put(cwd, 'apps/land/app/apply/page.tsx');
  const changes = collectChanges(cwd);
  const result = collectEvidence(cwd, changes, manifests);
  assert.equal(result.ok, true);
  assert.equal(result.branch, 'feature/51');
  assert.equal(result.base.ref, 'main');
  assert.deepEqual(result.paths, ['apps/land/app/apply/page.tsx']);
  assert.deepEqual(result.sources.untracked, result.paths);
  assert.equal(result.screenshots.targets[0].route, '/apply');
  assert.match(result.results, /Not collected/);
  assert.equal(Object.hasOwn(result, 'passed'), false);
});

test('PR evidence CLI fails closed for a staged land env file without revealing its contents', (t) => {
  const cwd = fixture(t);
  putManifests(cwd);
  const clean = cli(cwd, 'collect-pr-evidence');
  assert.equal(clean.status, 0);
  assert.equal(JSON.parse(clean.stdout).ok, true);
  const sentinel = 'PR_EVIDENCE_CONTENT_MUST_NOT_APPEAR';
  const path = 'apps/land/.env.production';
  put(cwd, path, `PRIVATE_VALUE=${sentinel}\n`);
  git(cwd, ['add', '--force', '--', path]);
  const output = cli(cwd, 'collect-pr-evidence');
  assert.equal(output.status, 1);
  const evidence = JSON.parse(output.stdout);
  assert.equal(evidence.ok, false);
  assert.deepEqual(evidence.suspicious, [path]);
  assert.deepEqual(evidence.sources.staged, [path]);
  assert.equal(`${output.stdout}${output.stderr}`.includes(sentinel), false);
  assert.equal(`${output.stdout}${output.stderr}`.includes('PRIVATE_VALUE='), false);
});

test('CLI rejects ambiguous flags and shell-quotes suggestions safely', () => {
  assert.equal(parseBase([]), undefined);
  assert.equal(parseBase(['--base', 'origin/main']), 'origin/main');
  assert.throws(() => parseBase(['--base']), /Usage/);
  assert.throws(() => parseBase(['--base', '--help']), /Usage/);
  assert.throws(() => parseBase(['--other', 'main']), /Usage/);
  assert.equal(shellQuote("a'$(x)"), "'a'\\''$(x)'");
});
