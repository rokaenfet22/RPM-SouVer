module.exports = {
    env: {
      browser: true,
      commonjs: true,
      es2021: true,
      node: true
    },
    extends: [
      'standard'
    ],
    parserOptions: {
      ecmaVersion: 12
    },
    rules: {
      "spaced-comment":["error","never"],
      "semi": [1, "never"],
      "camelcase": [0, {"properties": "never","ignoreDestructuring": true,"ignoreImports": false,"ignoreGlobals": true}],
      "no-unused-vars": [0, { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
      "space-infix-ops": ["error", { "int32Hint": true }],
      "quotes":[1,"double"],
      "comma-spacing":["error", { "before": false, "after": false }],
      "space-before-function-paren": ["off", {
        "anonymous": "always",
        "named": "always",
        "asyncArrow": "always"
      }],
      "eqeqeq":[2, "smart"],
      "no-undef":[0, { "typeof": false }]
    }
  };
