const rule = require('../../rules/no-http-url.js');
const { RuleTester } = require('eslint');
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('no-http-url', rule, {
  valid: [
    {
      code: "var test = 'https://hechenlong.com';",
    },
  ],
  invalid: [
    {
      code: "var test = 'http://hechenlong.com';",
      output: null,
      errors: [
        {
          message: '建议将 "http://hechenlong.com" 切换为 HTTPS',
        },
      ],
    },
  ],
});
