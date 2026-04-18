export default [
    {
        files: ['script.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script',
            globals: {
                window: 'readonly',
                document: 'readonly',
                localStorage: 'readonly',
                fetch: 'readonly',
                FormData: 'readonly',
                AbortController: 'readonly',
                IntersectionObserver: 'readonly',
                requestAnimationFrame: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                console: 'readonly'
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
