// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.expo/*'],
    rules: {
      // O'zbekcha matnda apostrof ko'p — JSX entity talabi matnni o'qib bo'lmaydigan qiladi
      'react/no-unescaped-entities': 'off',
      // RN Animated uchun ref'lar renderda olinadi; bu qoidalar React Compiler uchun,
      // mavjud animatsiya kodida esa xato emas
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]);
