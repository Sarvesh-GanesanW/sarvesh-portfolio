export default [
    {
        files: ['script.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script',
            globals: {
                window: 'readonly',
                document: 'readonly',
                IntersectionObserver: 'readonly',
                setTimeout: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-undef': 'error',
            'prefer-const': 'warn',
            'no-var': 'error',
            eqeqeq: ['error', 'smart']
        }
    }
];
