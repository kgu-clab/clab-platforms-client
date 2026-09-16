import { spawnSync } from 'node:child_process';
import { lstatSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const packagePaths = [
  'apps/land',
  'apps/member',
  'packages/design-system',
  'packages/config',
];
export const localDirectories = [
  '.agent-local',
  ...['task-cards', 'worklogs', 'pr-drafts', 'review-fixes', 'screenshots', 'proposals'].map(
    (name) => `.agent-local/${name}`
  ),
];

export const splitPaths = (output) => output.split('\0').filter(Boolean);
export const uniquePaths = (...groups) => [...new Set(groups.flat())].sort();

// Arguments never pass through a shell. Do not surface Git stderr or file contents.
export function git(cwd, args, { optional = false, input } = {}) {
  const result = spawnSync('git', args, {
    cwd,
    input,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    timeout: 30_000,
  });
  if (result.error || (result.status !== 0 && !optional)) {
    throw new Error(`Git ${args[0]} failed; inspect repository state locally.`);
  }
  return result;
}

export function parseBase(args) {
  if (!args.length) return undefined;
  if (args.length !== 2 || args[0] !== '--base' || !args[1] || args[1].startsWith('-')) {
    throw new Error('Usage: node .agent/scripts/<helper>.mjs [--base <ref>]');
  }
  return args[1];
}

export function resolveBase(cwd, explicit) {
  const branch = git(cwd, ['symbolic-ref', '--quiet', '--short', 'HEAD'], {
    optional: true,
  }).stdout.trim();
  const remoteHead = git(cwd, ['symbolic-ref', '--quiet', '--short', 'refs/remotes/origin/HEAD'], {
    optional: true,
  }).stdout.trim();
  const candidates = explicit
    ? [explicit]
    : uniqueInOrder([remoteHead, 'origin/main', 'origin/develop', 'main', 'develop']).filter(
        (ref) => ref !== branch
      );
  for (const ref of candidates) {
    const commit = git(cwd, ['rev-parse', '--verify', '--end-of-options', `${ref}^{commit}`], {
      optional: true,
    });
    if (commit.status !== 0) continue;
    const ancestor = git(cwd, ['merge-base', commit.stdout.trim(), 'HEAD'], { optional: true });
    if (ancestor.status === 0) {
      return { ref, mergeBase: ancestor.stdout.trim(), warning: null };
    }
  }
  if (explicit) throw new Error('Explicit base is unavailable or has no merge-base with HEAD.');
  return {
    ref: null,
    mergeBase: null,
    warning: 'Base unknown: branch commits are not included. Supply --base <actual-PR-base>.',
  };
}

function uniqueInOrder(items) {
  return [...new Set(items.filter(Boolean))];
}

export function collectChanges(cwd, explicit) {
  const base = resolveBase(cwd, explicit);
  const names = (args) => splitPaths(git(cwd, args).stdout);
  const diffNames = ['diff', '--no-ext-diff', '--no-textconv', '--no-renames', '--name-only', '-z'];
  const sources = {
    branch: base.mergeBase ? names([...diffNames, base.mergeBase, 'HEAD', '--']) : [],
    staged: names([...diffNames, '--cached', '--']),
    unstaged: names([...diffNames, '--']),
    untracked: names(['ls-files', '--others', '--exclude-standard', '-z']),
  };
  return {
    base,
    sources,
    paths: uniquePaths(...Object.values(sources)),
  };
}

export function suspiciousPaths(paths) {
  return uniquePaths(paths).filter((file) =>
    file
      .split('/')
      .some(
        (part) =>
          /^(?:\.agent-local|node_modules|\.next|\.turbo|\.pnpm-store|\.direnv|coverage|storybook-static|playwright-report|test-results)$/i.test(
            part
          ) ||
          /^\.env(?:rc)?(?:$|[.\-_])/i.test(part) ||
          /^(?:\.npmrc|\.netrc|credentials(?:\.json)?|id_rsa|id_ed25519)$/i.test(part) ||
          /\.(?:pem|key|p12|pfx)$/i.test(part)
      )
  );
}

export function assertLocalIgnored(cwd) {
  const tracked = splitPaths(git(cwd, ['ls-files', '-z', '--', '.agent-local']).stdout);
  if (tracked.length) throw new Error('.agent-local contains tracked files; do not initialize.');
  const probes = [
    ...localDirectories.map((dir) => `${dir}/`),
    ...localDirectories.map((dir) => `${dir}/probe.tmp`),
    '.agent-local/README.md',
  ];
  const ignored = git(cwd, ['check-ignore', '--no-index', '-z', '--stdin'], {
    optional: true,
    input: `${probes.join('\0')}\0`,
  });
  if (![0, 1].includes(ignored.status)) throw new Error('Unable to verify local ignore rules.');
  const matches = new Set(splitPaths(ignored.stdout));
  if (probes.some((path) => !matches.has(path))) {
    throw new Error('All .agent-local paths must be ignored before writing local artifacts.');
  }
}

function statIfPresent(file) {
  try {
    return lstatSync(file);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

export function initLocal(cwd) {
  const readme = '.agent-local/README.md';
  // Preflight every destination before creating anything; refuse symlink redirection.
  for (const path of [...localDirectories, readme]) {
    const stat = statIfPresent(join(cwd, path));
    if (stat && (path === readme ? !stat.isFile() : !stat.isDirectory())) {
      throw new Error(
        'Local workspace destinations must be regular files/directories, not symlinks.'
      );
    }
  }
  assertLocalIgnored(cwd);
  for (const path of localDirectories) mkdirSync(join(cwd, path), { recursive: true });
  if (!statIfPresent(join(cwd, readme))) {
    writeFileSync(
      join(cwd, readme),
      '# C-Lab local workspace\n\nIgnored task cards, worklogs, PR drafts, review fixes, screenshots and proposals. Never commit these files.\n',
      { flag: 'wx' }
    );
  }
  return { initialized: '.agent-local', ignored: true };
}

export function checkLocalFiles(cwd, changes) {
  assertLocalIgnored(cwd);
  const tracked = splitPaths(git(cwd, ['ls-files', '-z']).stdout);
  // Existing shared root template/registry config are not private workspace leaks.
  // A changed or untracked copy still requires review; never inspect their values here.
  const sharedConfig = new Set(['.env.example', '.npmrc']);
  const suspicious = suspiciousPaths([
    ...tracked.filter((path) => !sharedConfig.has(path)),
    ...changes.paths,
  ]);
  return { ok: suspicious.length === 0, suspicious, base: changes.base };
}

export function textHygiene(text) {
  if (text.includes('\0')) return [];
  return text.split('\n').flatMap((line, index) => {
    const value = line.replace(/\r$/, '');
    return /[\t ]+$/.test(value) || /^(?:<{7}|={7}|>{7})(?: |$)/.test(value) ? [index + 1] : [];
  });
}

export function checkDiffHygiene(cwd, changes) {
  const local = checkLocalFiles(cwd, changes);
  const checks = {
    staged: ['--cached'],
    unstaged: [],
    ...(changes.base.mergeBase ? { branch: [changes.base.mergeBase, 'HEAD'] } : {}),
  };
  const failedLayers = [];
  for (const [layer, range] of Object.entries(checks)) {
    const result = git(cwd, ['diff', '--no-ext-diff', '--no-textconv', '--check', ...range, '--'], {
      optional: true,
    });
    if (result.status !== 0) {
      // Check candidate paths individually: Git's --check output includes source lines.
      const paths = changes.sources[layer].filter(
        (path) =>
          git(
            cwd,
            [
              '--literal-pathspecs',
              'diff',
              '--no-ext-diff',
              '--no-textconv',
              '--check',
              ...range,
              '--',
              path,
            ],
            { optional: true }
          ).status !== 0
      );
      failedLayers.push({ layer, paths });
    }
  }
  const untrackedIssues = [];
  for (const path of changes.sources.untracked) {
    if (suspiciousPaths([path]).length) continue;
    const file = join(cwd, path);
    if (!statIfPresent(file)?.isFile()) continue;
    const lines = textHygiene(readFileSync(file, 'utf8'));
    if (lines.length) untrackedIssues.push({ path, lines });
  }
  return {
    ...local,
    ok: local.ok && !failedLayers.length && !untrackedIssues.length,
    failedLayers,
    untrackedIssues,
    branchNote:
      'Branch checks cover merge-base..HEAD and may include merged history; failures are not automatically attributable to the current ticket.',
  };
}

export function readManifests(cwd) {
  return Object.fromEntries(
    // Deliberately enumerate this repository's packages; update packagePaths when they change.
    ['', ...packagePaths].map((path) => {
      const manifestPath = path ? `${path}/package.json` : 'package.json';
      let contents;
      try {
        contents = readFileSync(join(cwd, manifestPath), 'utf8');
      } catch {
        throw new Error(`Unable to read manifest: ${manifestPath}.`);
      }
      try {
        return [path, JSON.parse(contents)];
      } catch {
        throw new Error(`Unable to parse manifest JSON: ${manifestPath}.`);
      }
    })
  );
}

export function shellQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`;
}

export function selectVerification(paths, manifests) {
  const scopes = packagePaths.filter((scope) => paths.some((path) => path.startsWith(`${scope}/`)));
  const rootConfig = paths.some((path) =>
    /^(?:package\.json|pnpm-lock\.yaml|pnpm-workspace\.yaml|turbo\.json|\.github\/workflows\/)/.test(
      path
    )
  );
  const harness = paths.some(
    (path) =>
      path.startsWith('.agent/') ||
      ['AGENTS.md', 'CLAUDE.md', 'package.json', '.gitignore'].includes(path)
  );
  const affected = new Set(scopes);
  if (rootConfig || scopes.some((scope) => scope.startsWith('packages/'))) {
    packagePaths.forEach((scope) => affected.add(scope));
  }
  const command = (scope, script) => {
    if (!manifests[scope]?.scripts?.[script]) return [];
    return [
      scope ? `pnpm --filter ${shellQuote(manifests[scope].name)} ${script}` : `pnpm ${script}`,
    ];
  };
  return {
    scopes,
    rootConfig,
    baseline: paths.length ? ['lint', 'build'].flatMap((script) => command('', script)) : [],
    targeted: packagePaths
      .filter((scope) => affected.has(scope))
      .flatMap((scope) => ['lint', 'build'].flatMap((script) => command(scope, script))),
    harness: harness ? ['agent:test', 'agent:check'].flatMap((script) => command('', script)) : [],
    notes: [
      'Suggestions only; no checks have been run.',
      'Root Turbo test and installed test dependencies do not prove app tests exist or pass.',
      'Run Prettier --check on changed supported files using safe argument arrays.',
    ],
  };
}

// Only extant changed Next page files provide automatic URL evidence.
// Other routers, consumers and layouts require source-level review, not a filename guess.
export function planScreenshots(paths, existingPaths) {
  const existing = new Set(existingPaths);
  const targets = [];
  const needsInspection = [];
  for (const path of uniquePaths(paths)) {
    if (path.startsWith('apps/member/src/api/')) continue;
    const page = path.match(/^apps\/land\/app\/(.*\/)?page\.(?:tsx|ts|jsx|js)$/);
    if (page && existing.has(path)) {
      const segments = (page[1] || '').split('/').filter(Boolean);
      if (!segments.some((segment) => /^[@_]/.test(segment) || /^\(\./.test(segment))) {
        const route = `/${segments.filter((segment) => !/^\([^)]*\)$/.test(segment)).join('/')}`;
        targets.push({
          app: 'land',
          route,
          source: path,
          dynamic: route.includes('['),
          viewports: ['1440x900', '390x844'],
        });
        continue;
      }
    }
    const uiSurface =
      /^(?:apps\/land\/(?:app|components)\/|apps\/member\/src\/(?:app|pages|components)\/|packages\/design-system\/(?:src|\.storybook)\/).*\.(?:tsx|jsx)$/.test(
        path
      ) ||
      /^(?:apps\/land\/components\/|apps\/member\/src\/(?:app\/route|pages|components)\/|packages\/design-system\/src\/components\/).*\.(?:ts|js)$/.test(
        path
      ) ||
      /^(?:apps\/(?:land|member)\/|packages\/(?:design-system|config)\/).*\.(?:css|scss|sass|less|svg|png|jpe?g|webp|avif|gif|ico|woff2?|ttf|otf)$/.test(
        path
      );
    if (page || uiSurface) {
      needsInspection.push(path);
    }
  }
  return {
    targets,
    needsInspection,
    note: 'No fallback route. Inspect member route config, consuming pages or Storybook stories; resolve dynamic data before capture. No browser checks have been run.',
  };
}

export function screenshotPlan(cwd, changes) {
  const existing = changes.paths.filter((path) => statIfPresent(join(cwd, path))?.isFile());
  return { base: changes.base, ...planScreenshots(changes.paths, existing) };
}

export function collectEvidence(cwd, changes, manifests) {
  const local = checkLocalFiles(cwd, changes);
  return {
    branch: git(cwd, ['branch', '--show-current']).stdout.trim() || '(detached HEAD)',
    head: git(cwd, ['rev-parse', '--verify', 'HEAD']).stdout.trim(),
    ...changes,
    ...local,
    verification: selectVerification(changes.paths, manifests),
    screenshots: screenshotPlan(cwd, changes),
    results:
      'Not collected: attach actual command outcomes and reviewed browser evidence separately.',
  };
}

export function runCli(action, { acceptsBase = true } = {}) {
  try {
    const args = process.argv.slice(2);
    if (!acceptsBase && args.length) throw new Error('This helper takes no arguments.');
    const base = acceptsBase ? parseBase(args) : undefined;
    const cwd = git(process.cwd(), ['rev-parse', '--show-toplevel']).stdout.trim();
    const result = action(cwd, base);
    console.log(JSON.stringify(result, null, 2));
    if (result.ok === false) process.exitCode = 1;
  } catch (error) {
    // Unexpected filesystem errors can contain private paths; only expose deliberate diagnostics.
    console.error(
      JSON.stringify({ error: error.code ? 'Filesystem operation failed.' : error.message })
    );
    process.exitCode = 1;
  }
}
