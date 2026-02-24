module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    setupFiles: ['<rootDir>/tests/jest.setup.ts'],
    forceExit: true,
    clearMocks: true,
    resetModules: true,
    restoreMocks: true
};

