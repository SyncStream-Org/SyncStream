module.exports = {
  extends: 'erb',
  plugins: ['@typescript-eslint'],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-import-module-exports': 'off',
    'no-shadow': 'off',
    'no-restricted-syntax': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-unused-vars': 'off',
    'no-bitwise': 'off',
    'no-alert': 'off',
    'no-console': 'off',
    'import/no-mutable-exports': 'off',
    'import/prefer-default-export': 'off',
    'react/destructuring-assignment': 'off',
    'promise/always-return': 'off',
    'promise/catch-or-return': 'off',
    'no-await-in-loop': 'off',
    'no-use-before-define': 'off',
    'promise/no-nesting': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prefer-stateless-function': 'off',
    'react/static-property-placement': 'off',
    'react/button-has-type': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'react/require-default-props': 'off',
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
