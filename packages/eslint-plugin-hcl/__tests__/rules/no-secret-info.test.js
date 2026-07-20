const rule = require('../../rules/no-secret-info');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('no-secret-info', rule, {
  valid: [
    {
      code: 'var token = process.env.ACCESS_KEY_SECRET;',
    },
    {
      code: 'var password = "";',
    },
    {
      code: `
    var client ={
      token: process.env.ACCESS_KEY_SECRET
    };
    `,
    },
  ],

  invalid: [
    {
      code: "var token = 'xxxx';",
      errors: [
        {
          message: '检测 "xxxx" 可能是一个密钥，请检查！',
        },
      ],
    },
    {
      code: `
    var client ={
      token: 'xxxx'
    };
    `,
      errors: [
        {
          message: '检测 "xxxx" 可能是一个密钥，请检查！',
        },
      ],
    },
  ],
});
