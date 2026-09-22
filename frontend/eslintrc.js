module.exports = {
  root: true,
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ["@vue/cli-plugin-babel/preset"],
    },
  },
  env: {
    browser: true,
    node: true,
  },
  globals: {
    google: "readonly", // <-- вказуємо, що google це глобальна змінна
  },
  extends: ["plugin:vue/vue3-recommended", "eslint:recommended"],
  rules: {
    // твої правила
  },
};
