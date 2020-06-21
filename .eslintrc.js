module.exports = {
    root: true,
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module',
        ecmaVersion: 8,
        ecmaFeatures: {
            jsx: true
        }
    },
    extends: [
        'eslint:recommended',
        'standard',
        'plugin:vue/strongly-recommended'
    ],
    plugins: [
        'vue',
        'standard',
        'promise'
    ],
    'rules': {
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'comma-dangle': 'off',
        'indent': ['error', 4],
        'linebreak-style': 'off',
        'no-unused-vars': ['warn'],
        'one-var': 0,
        'generator-star-spacing': 'off',
        'semi': ['off', 'always'],
        'eqeqeq': 0,
        'no-extend-native': 0,
        'standard/array-bracket-even-spacing': 0,
        'spaced-comment': 0,
        'keyword-spacing': 0,
        'space-before-function-paren': 0,
        'quotes': ['warn', 'single'],
        'max-lines': [2, 10000],
        'max-len': [1, 10000, 2, { ignoreComments: true }],
        'camelcase': 'off',
        'prefer-promise-reject-errors': 'off',
        'no-return-assign': 'off',
        'no-multiple-empty-lines': 'off',
        'no-trailing-spaces': 'off',
        'handle-callback-err': 'off',
        'standard/object-curly-even-spacing': 'off',
        'no-console': 0,
        'comma-spacing': 'warn',
        'padded-blocks': 'warn',
        'quote-props': ['error', 'as-needed'],
        'vue/html-indent': ['warn', 4],
        'vue/max-attributes-per-line': 'off',
        'vue/html-self-closing': ['error', {
            'html': {
                'void': 'never',
                'normal': 'never',
                'component': 'any'
            },
            'svg': 'always',
            'math': 'always'
        }],
        'vue/mustache-interpolation-spacing': ['error', 'always'],
        'vue/attribute-hyphenation': ['error', 'always', {
            'ignore': []
        }],
        'vue/require-prop-types': 'error',
        'vue/require-default-prop': 'error',
        'vue/no-spaces-around-equal-signs-in-attribute': ['error'],
        'no-mixed-operators': 'off',
        'vue/prop-name-casing': ['error', 'camelCase'],
        'vue/name-property-casing': ['error', 'PascalCase'],
        'vue/singleline-html-element-content-newline': 'off',
        'vue/no-parsing-error': 'off',
        'vue/no-use-v-if-with-v-for': 'off',
        'vue/no-unused-vars': 'off',
        'vue/html-quotes': ['error', 'double']
    },
    globals: {
        App: true,
        Page: true,
        wx: true,
        swan: true,
        tt: true,
        my: true,
        getApp: true,
        getPage: true,
        requirePlugin: true,
        mpvue: true,
        mpvuePlatform: true,
        getCurrentPages: true,
        define: true
    }
}
