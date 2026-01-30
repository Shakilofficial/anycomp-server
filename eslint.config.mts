import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-config-prettier';

export default defineConfig([
    {
        ignores: ['**/node_modules/', '.dist/'],
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: { globals: globals.browser },
        rules: {
            'no-unused-vars': 'error',
            'no-unused-expressions': 'error',
            'prefer-const': 'error',
            'no-console': 'warn',
            'no-undef': 'error',
        },
    },
    eslintPluginPrettierRecommended,
    tseslint.configs.recommended,
]);
