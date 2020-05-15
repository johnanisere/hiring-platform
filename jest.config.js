module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/client/'],
  setupFilesAfterEnv: ['./jest.setup.js'],
};
