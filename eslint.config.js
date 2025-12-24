// eslint.config.js
import globals from 'globals';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node, // incluye console, process, __dirname, etc.
      },
    },
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'no-console': ['off'],
      'no-unused-vars': ['warn'],
      'no-undef': ['error']
    },
  },
];
