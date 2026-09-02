import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([

  // 1. Abaikan file/folder yang tidak perlu diperiksa
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.git/**",
      "**/coverage/**",
      "**/.vscode/**",
      "**/*.min.js",
      "**/*.config.ts",
      "**/*.config.js"
    ]
  },
  
  // 2. JS/TS/Vue Global Settings
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022
      },
      ecmaVersion: 2022,
      sourceType: "module"
    }
  }, 

  // 3. JavaScript Recommended Rules
  js.configs.recommended,
  
  // 4. TypeScript Recommended Rules
  ...tseslint.configs.recommended,

  // Vue (lebih bagus pakai recommended, bukan essential)
  ...pluginVue.configs["flat/recommended"],
  
  // Support TS di Vue
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 2022,
        sourceType: "module"
      }
    }
  },

  // 5. IMPLEMENTASI RULE LARANGAN (Custom Rules)
  {
    files: ["**/*.{js,ts,vue}"],
    rules: {
      // === Larangan dasar ===
      "eqeqeq": ["error", "always", { null: "ignore" }],  // Wajib === dan !==
      "no-var": "error",                                   // Larangan var
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-alert": process.env.NODE_ENV === "production" ? "error" : "warn",
      
      // === TypeScript larangan ===
      "@typescript-eslint/no-explicit-any": "error",       // Larangan tipe any
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }],
      "@typescript-eslint/no-empty-function": "warn",   
      "@typescript-eslint/no-inferrable-types": "off",

      // === Penamaan wajib camelCase (function, variable, parameter) ===
      "@typescript-eslint/naming-convention": [
        "error",
        // function declaration & method wajib camelCase
        {
          selector: ["function", "classMethod", "objectLiteralMethod", "typeMethod"],
          format: ["camelCase"],
          leadingUnderscore: "allow"
        },
        // variable: camelCase; UPPER_CASE untuk konstanta modul.
        // PascalCase tetap diizinkan karena dipakai untuk referensi komponen Vue
        // (lazy import route, defineAsyncComponent). Efeknya: rule ini melarang snake_case.
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow"
        },
        // nama parameter wajib camelCase
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow"
        }
      ],

      // === untuk mencegah pemakaian syntax Object.assign ===
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.object.name='Object'][callee.property.name='assign']",
          message: "Penggunaan Object.assign() tidak diperbolehkan."
        },
        // Variable yang isinya function (arrow function) wajib camelCase.
        // Lazy import route (`() => import(...)`) dikecualikan: itu referensi komponen, bukan function biasa.
        {
          selector: "VariableDeclarator[id.name=/^[A-Z]/][init.type=/^(Arrow)?FunctionExpression$/]:not([init.body.type=/^ImportExpression$/])",
          message: "Nama function / method harus camelCase, bukan PascalCase. Contoh: `Delete` -> `deleteData`, `SendRequest` -> `sendRequest`."
        },
        // deklarasi composable/store wajib disimpan dengan nama camelCase.
        {
          selector: "VariableDeclarator[id.name=/^[A-Z]/][init.type=/^CallExpression$/][init.callee.name=/^use[A-Z]/]",
          message: "deklarasi composable/store harus disimpan dengan nama camelCase. Contoh: `MenuStore` -> `menuStore`."
        },
        // PascalCase hanya boleh untuk lazy import route dan defineAsyncComponent.
        // Sisanya (object, computed, hasil defineModel, dll) wajib camelCase.
        // Regex `/^[A-Z].*[a-z]/` mensyaratkan ada huruf kecil, supaya konstanta
        // UPPER_CASE (TOKEN_PHOENIX, POPOVER_WIDTH) tidak ikut kena.
        {
          selector: "VariableDeclarator[id.name=/^[A-Z].*[a-z]/]:not([init.type=/^(Arrow)?FunctionExpression$/]):not([init.callee.name=/^use[A-Z]/]):not([init.callee.name=/^defineAsyncComponent$/])",
          message: "Variable PascalCase hanya diizinkan untuk lazy import route (`() => import(...)`) dan `defineAsyncComponent(...)`. Selain itu wajib camelCase."
        }
      ]
    },
  },
  // Untuk file Vue
  {
    files: ["**/*.vue"],
    rules: {
      "vue/require-default-prop": "warn",                 // Memaksa props yang optional harus punya default
      "vue/multi-word-component-names": "warn",           // Komponen minimal 2 kata
      "vue/require-v-for-key": "error",                    // v-for wajib key
      "vue/no-mutating-props": "error",                    // Larangan mutasi props
      "vue/no-v-html": "error",                             // Hati2 dengan v-html (XSS)
      "vue/attributes-order": "warn",                       // Urutan atribut konsisten
      'vue/prop-name-casing': ['error', 'camelCase'],       // Penamaan props child musti camelCase
      'vue/max-attributes-per-line': [                      // max attribute props per baris
        'error',
        {
          singleline: {
            max: 4,
          },
          multiline: {
            max: 4,
          },
        },
      ],

      'vue/first-attribute-linebreak': [                    // posisi new line ketika mencapai max attribute per baris
        'error',
        {
          singleline: 'ignore',
          multiline: 'below',
        },
      ],

      // Komponen wajib di import
      // router-link & router-view dikecualikan: keduanya global dari `app.use(router)` dan tidak di import.
      'vue/no-undef-components': ['error', {
        ignorePatterns: ['router-link', 'router-view'],
      }],

      // Variable / property yang dipakai di <template> wajib ada di declare.
      'vue/no-undef-properties': 'error',
    }
  }

]);
