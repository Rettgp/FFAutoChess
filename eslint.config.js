import prettier from 'eslint-plugin-prettier';

export default [
    {
        plugins: {
            prettier,
        },
        rules: {
            'prettier/prettier': 'error',
            semi: 'error',
            'prefer-const': 'error',
        },
    },
];
