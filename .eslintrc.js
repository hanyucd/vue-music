// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
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
    'vue'
  ],
  // add your custom rules here
  /*
    配置参数：

    "规则名": [规则值, 规则配置]
    规则值：
          "off" 或者 0    //关闭规则关闭
          "warn" 或者 1    //在打开的规则作为警告（不影响退出代码）
          "error" 或者 2    //把规则作为一个错误（退出代码触发时为 1）
  */
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'semi': ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    'template-curly-spacing': ['error', 'always'],
    'no-trailing-spaces': 'off'
  }
}
