module.exports = {
  singleQuote: true,
  trailingComma: "all",
  semi: false,
  tabWidth: 2,
  jsxSingleQuote: true,
  printWidth: 120,
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: "avoid",
  formatOnSave: true,
  formatOnType: true,
  eslint: { enable: true },
  proseWrap: "always",
  editor: {
    codeActionsOnSave: {
      source: {
        fixAll: {
          eslint: true,
        },
      },
    },
  },
};
