module.exports = {
  parserPreset: {
    parserOpts: {
      headerPattern:
        /^(?<emoji>:[a-z_]+:|[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])\s\((?<scope>[a-zA-Z0-9-_]+)\)\s(?<subject>.+)$/u,
      headerCorrespondence: ['emoji', 'scope', 'subject'],
    },
  },
  rules: {
    'scope-enum': [2, 'always', ['land', 'member', 'config', 'design-system', '*']],
    'subject-empty': [2, 'never'],
    'header-max-length': [2, 'always', 100],
    'subject-full-stop': [2, 'never', '.'],
  },
};
