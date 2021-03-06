'use strict';

module.exports = {
  clearMocks: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "src(\/.*)?\/__tests__\/.*\.test\.tsx?$",
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  setupFilesAfterEnv: ['./test/configureEnzyme'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
      diagnostics: false,
    },
  },
};
