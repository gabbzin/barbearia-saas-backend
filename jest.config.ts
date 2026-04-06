import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleFileExtensions: ["js", "json", "ts"],
	testRegex: ".*\\.spec\\.ts$",
	transform: {
		"^.+\\.(t|j)s$": ["ts-jest", { tsconfig: "tsconfig.spec.json" }],
	},
	moduleNameMapper: {
		"^src/(.*)$": "<rootDir>/src/$1",
		"^@thallesp/nestjs-better-auth$":
			"<rootDir>/test/mocks/nestjs-better-auth.ts",
		"^\.\./auth/auth\.guard$": "<rootDir>/test/mocks/auth.guard.ts",
		"^\.\./auth/roles\.guard$": "<rootDir>/test/mocks/roles.guard.ts",
	},
};

export default config;
