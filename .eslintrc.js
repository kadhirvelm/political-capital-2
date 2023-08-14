module.exports = {
    "env": {
      "browser": true,
      "es2022": true,
      "node": true
    },
    "extends": [
      "eslint:recommended",
      "turbo",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:import/recommended",
      "plugin:sonarjs/recommended",
      "plugin:unicorn/recommended",
      "plugin:promise/recommended",
      "plugin:typescript-sort-keys/recommended",
      "plugin:react/recommended",
      "prettier"
    ],
    "parser": '@typescript-eslint/parser',
    "parserOptions": {
      "ecmaVersion": "es2022",
      "tsconfigRootDir": __dirname,
      "sourceType": "module",
      "project": [
        "./tsconfig.json",
        "./packages/*/tsconfig.json",
      ],
    },
    "plugins": [
      "@typescript-eslint",
      "sort-keys-fix",
      "typescript-sort-keys",
      "promise",
      "react",
      "header",
      "prettier"
    ],
    "root": true,
    "ignorePatterns": ["*dist*"],
    "rules": {
      "prettier/prettier": ["error"],
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "sort-keys-fix/sort-keys-fix": "error",
      "sort-keys": ["error", "asc", { "caseSensitive": true, "natural": false, "minKeys": 2 }],
      "react/jsx-sort-props": ["error"],
      "header/header": [2, "block", "\n * Copyright 2023 KM.\n ", 2],
      "unicorn/filename-case": [2, { "case": "camelCase" }],
    },
    "settings": {
      "import/resolver": {
        typescript: {
          project: "<root>/tsconfig.json",
        },
      },
      "react": {
        "version": "detect"
      },
      jest: {
            version: "^26.6.0",
        },
    }
  }
