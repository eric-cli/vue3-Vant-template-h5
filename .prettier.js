module.exports = {
  tabWidth: 2,
  useTabs: false,
  vueIndentScriptAndStyle: true,
  jsxSingleQuote: true,
  jsxBracketSameLine: true,
  printWidth: 100,
  singleQuote: true,
  trailingComma: "none",
  bracketSpacing: true,
  semi: false,
  overrides: [
    {
      files: "*.json",
      options: {
        printWidth: 200,
      },
    },
  ],
  arrowParens: "always",
};
