const rule = require('../../rules/no-broad-semantic-versioning.js');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester();

ruleTester.run('no-broad-semantic-versioning', rule, {
  valid: [
    {
      filename: 'package.json',
      code: `module.exports = ${JSON.stringify({
        devDependencies: { 'eslint-plugin-hcl': '^0.0.1' },
      })}`,
    },
    {
      filename: 'package.js',
      code: 'var t = 1',
    },
  ],

  invalid: [
    {
      filename: 'package.json',
      code: `module.exports = ${JSON.stringify({
        devDependencies: { 'eslint-plugin-hcl': '*' },
      })}`,
      errors: [
        {
          message: '不建议对 "eslint-plugin-hcl" 使用 "*"',
        },
      ],
    },
  ],
});
