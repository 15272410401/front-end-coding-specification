const rule = require('../../rules/no-http-url.js');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester();

ruleTester.run('no-http-url', rule, {
  valid: [
    {
      code: "var test = 'https://hechenlong.com';",
    },
  ],

  invalid: [
    {
      code: "var test = 'http://hechenlong.com';",
      output: "var test = 'http://hechenlong.com';",
      errors: [
        {
          message: '建议将 "http://hechenlong.com" 切换为 HTTPS',
        },
      ],
    },
    {
      code: "<img src='http://hechenlong.com' />",
      output: "<img src='http://hechenlong.com' />",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      errors: [
        {
          message: '建议将 "http://hechenlong.com" 切换为 HTTPS',
        },
      ],
    },
  ],
});
