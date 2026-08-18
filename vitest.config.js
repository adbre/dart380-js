export default {
    test: {
        environment: 'node',
        globals: true,
        include: ['test/**/*Spec.js'],
        setupFiles: ['test/setup.js'],
    },
};
