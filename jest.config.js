/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.(test|spec).[jt]s?(x)"],
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  modulePaths: ["<rootDir>/tests"],
  moduleDirectories: ["node_modules", "tests"],
};
