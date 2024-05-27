module.exports = {
    root: true,
    env: { browser: true, es2020: true, node: true },
    extends: [
        // By extending from a plugin config, we can get recommended rules without having to add them manually.
        'eslint:recommended',
        'plugin:react-hooks/recommended',
        'plugin:import/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:@typescript-eslint/strict-type-checked',
        // This disables the formatting rules in ESLint that Prettier is going to be responsible for handling.
        // Make sure it's always the last config, so it gets the chance to override other configs.
        'eslint-config-prettier',
    ],
    ignorePatterns: ["**/node_modules/", ".git/", 'public/', 'build/', 'dist/', 'dev-dist/', '.eslintrc.cjs'],
    parserOptions: {
        project: ['tsconfig.json'],

    },
    plugins: ['react-refresh', 'react-hooks', 'jsx-a11y', 'import', 'prettier'],
    rules: {
        "no-restricted-imports": "off",
        "@typescript-eslint/no-restricted-imports": [
            'error',
            {
                "paths": [
                    {
                        "name": "react-redux",
                        "importNames": ["useSelector", "useStore", "useDispatch"],
                        "message": "Please use pre-typed versions from `src/app/hooks.ts` instead."
                    },
                    {
                        "name": "@reduxjs/toolkit",
                        "importNames": ["createSlice"],
                        "message": "Please use thunk-able versions from `src/app/createAppSlice.ts` instead."
                    },
                    {
                        "name": "@reduxjs/toolkit",
                        "importNames": ["createAsyncThunk"],
                        "message": "Please use thunk-able versions from `src/app/createAppAsyncThunk.ts` instead."
                    }
                ]
            }
        ],
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/restrict-template-expressions': ['error', {
            allowNullish: true
        }],
        '@typescript-eslint/restrict-plus-operands': ['error', {
            allowNullish: true
        }],
        '@typescript-eslint/no-invalid-void-type': ['off'],
        '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
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
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
        },
        'import/resolver': {
            "typescript": {
                "alwaysTryTypes": true,
                project: ['tsconfig.json']
            }
        }
    },
    reportUnusedDisableDirectives: true

}
