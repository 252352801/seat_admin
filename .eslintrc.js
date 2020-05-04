// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  // parser: 'babel-eslint',
  parserOptions: {
    "parser": 'babel-eslint',
    "ecmaVersion": 2018, //指定ECMAScript支持的版本，6为ES6
    "sourceType": "module" //指定来源的类型，有两种”script”或”module”
  },
  env: {
    browser: true,
    "es6": true,
    "node": true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue',
    'flowtype-errors'
  ],
  // add your custom rules here
  rules: {
    // "no-unused-vars":"off",
    // allow async-await
    "dot-notation":0,
    "semi":[2,'never'],
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "flowtype-errors/show-errors": 2
  }
}
const regExp = /for\s*\(let o in obj\)\s*/
