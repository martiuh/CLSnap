module.exports = {
  roots: ['src'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/tests/**/*.test.[jt]s?(x)'],
};
