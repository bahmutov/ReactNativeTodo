# ReactNativeTodo

This code was originally copied from [stassop/ReactNativeTodo](https://github.com/stassop/ReactNativeTodo). The original unit and integration tests were described in the blog post [Quick Guide to React Native Testing](https://stassop.medium.com/quick-guide-to-react-native-testing-a5a830223c9e) by [Stanislav Sopov](https://github.com/stassop).

## Add Expo

First, let's add [Expo](https://docs.expo.io/guides/running-in-the-browser/) to this project to be able to work with the RN app in the browser. Follow the example in [bahmutov/react-native-to-expo](https://github.com/bahmutov/react-native-to-expo).

```text
# match the React DOM version to the React version
$ npm i -D expo expo-cli react-native-web react-dom@17.0.1
+ react-dom@17.0.1
+ react-native-web@0.17.0
+ expo-cli@4.5.2
+ expo@41.0.1
```

