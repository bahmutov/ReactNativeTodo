module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'istanbul',
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.js',
        ],
        alias: {
          '@': './',
        },
      },
    ],
  ],
};
