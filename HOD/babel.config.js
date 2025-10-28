module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // ...andre plugins her hvis du har nogen
      'react-native-reanimated/plugin', // <-- SKAL være SIDST
    ],
  };
};
