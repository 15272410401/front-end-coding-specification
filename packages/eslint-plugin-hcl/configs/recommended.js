module.exports = {
  plugins: ['eslint-plugin-hcl'],
  rules: {
    'eslint-plugin-hcl/no-broad-semantic-versioning': 'error',
    'eslint-plugin-hcl/no-http-url': 'warn',
    'eslint-plugin-hcl/no-secret-info': 'error',
  },
};
