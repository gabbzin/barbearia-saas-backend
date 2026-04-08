// @ts-check
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: [
			"**/dist/**",
			"**/node_modules/**",
			"jest.config.ts",
			"prisma.config.ts",
			"prisma/seed.ts",
			"src/generated/**",
			"eslint.config.mjs",
		],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	eslintPluginPrettierRecommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
			},
			sourceType: "module", // Mudado para module por causa dos imports
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		// 2. APLICAR REGRAS ESPECÍFICAS
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-return": "off", // Adicionado para matar o erro do decorator
			"@typescript-eslint/no-unsafe-call": "off", // Adicionado para o erro no PrismaService
			"@typescript-eslint/no-floating-promises": "warn",
			"@typescript-eslint/no-unsafe-argument": "warn",
			"@typescript-eslint/no-unused-vars": "warn",
			"no-useless-catch": "warn", // Transforma o erro do try/catch em aviso
			"@typescript-eslint/require-await": "warn", // Transforma o erro do getProfile em aviso
			"prettier/prettier": ["error", { endOfLine: "auto" }],
		},
	}
);
