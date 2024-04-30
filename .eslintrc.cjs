module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended'
    ],
    ignorePatterns: ['build', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['tsconfig.json']
    },
    plugins: ['react-refresh', 'react-hooks', 'jsx-a11y', 'import', 'prettier'],
    rules: {
        "@typescript-eslint/no-restricted-imports": [
            2,
            {
                "paths": [
                    {
                        "name": "react-redux",
                        "importNames": ["useSelector", "useStore", "useDispatch"],
                        "message": "Please use pre-typed versions from `src/app/hooks.ts` instead."
                    },

                    {
                        "name": "'@reduxjs/toolkit'",
                        "importNames": ["createSlice"],
                        "message": "Please use thunk-able versions from `src/app/createAppSlice.ts` instead."
                    }
                ]
            }
        ],
        'react-refresh/only-export-components': [
            'error',
            { allowConstantExport: true },
        ],
        "@typescript-eslint/no-explicit-any": [
            'error'
        ],
        'react-hooks/rules-of-hooks': 'error',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                args: 'after-used',
                argsIgnorePattern: '^_',
                ignoreRestSiblings: true,
            },
        ],

        '@typescript-eslint/await-thenable': 'warn',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-misused-promises': [
            'error',
            {
                checksConditionals: false,
                checksVoidReturn: false,
            },
        ],
        '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
        '@typescript-eslint/no-unused-expressions': 'error',

        '@typescript-eslint/prefer-as-const': 'warn',
        '@typescript-eslint/promise-function-async': 'warn',
        'import/default': 'error',
        'import/export': 'error',
        'import/named': 'error',
        'import/no-cycle': 'error',
        'import/no-duplicates': 'error',
        'import/no-unresolved': 'error',
        'import/no-useless-path-segments': 'warn',
        'import/order': [
            'warn',
            {
                alphabetize: {
                    caseInsensitive: true,
                    order: 'asc',
                },
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                    'object',
                ],
                'newlines-between': 'always',
            },
        ],
        'no-constant-binary-expression': 'error',
        'no-constant-condition': 'error',
        'no-dupe-args': 'error',
        'no-dupe-keys': 'error',
        'no-empty-pattern': 'error',
        'no-extra-boolean-cast': 'error',
        'no-redeclare': 'error',
        'no-return-await': 'error',
        'no-unsafe-negation': 'warn',
        'no-unused-private-class-members': 'error',
        'prefer-const': 'warn',
        'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],

        // Prevent unexpected parseInt() output that does not return the number calculated in decimal when given a value such as parseInt(071).
        radix: 'error',
        'require-atomic-updates': ['error', { allowProperties: true }],
        'valid-typeof': 'warn',
        "react-hooks/exhaustive-deps": [
            "error"
        ]
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.mjs', '.js', 'cjs', '.jsx', '.ts', '.tsx'],
            },
        }
    }
}
