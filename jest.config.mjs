/**@type {import('jest').Config} */
export default {
  verbose: true,
  testEnvironment: 'jsdom',
  testMatch: ['**/*.spec.mjs'],
  transform: {
    '^.+\\.(mjs|js)?$': 'babel-jest',
  },
  "transformIgnorePatterns": ['node_modules/(?!nanostores)'],
  moduleFileExtensions: ['js', 'mjs'],
};
