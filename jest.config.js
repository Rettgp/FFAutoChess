/** @type {import('ts-jest').JestConfigWithTsJest} **/
// import { pathsToModuleNameMapper } from 'ts-jest';
// import { compilerOptions } from './tsconfig.json' with { type: 'json' };

export default {
  testEnvironment: "node",
  transform: {
    "^.+.ts?$": ["ts-jest",{}],
  },
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths /*, { prefix: '<rootDir>/' } */ )
};