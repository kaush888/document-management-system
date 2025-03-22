module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: './coverage',
    testTimeout: 30000,
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1', // Ensure Jest resolves absolute imports
    },
  };
  