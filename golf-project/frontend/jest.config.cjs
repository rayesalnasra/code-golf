// jest.config.js
module.exports = {
    transform: {
        '^.+\\.(js|jsx)$': '<rootDir>/jest-transform.cjs',
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
        '/node_modules/(?!(@firebase|firebase)/)'
    ],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};
