# React Native Animated App Base Template

![ReactIcon](./React-icon.svg)

This template provides the basic and necessary things you need for a React Native app.

# Features

- ⚙️ Built with [Typescript](https://www.typescriptlang.org/)
- ⚡ More comprehensive animations via [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)
- 🎨 Theming and component styling via [styled-components](https://styled-components.com/)
- 🖼️ SVG support via [react-native-svg](https://github.com/react-native-svg/react-native-svg)
- 📄 Exposing config variables via [react-native-config](https://github.com/luggit/react-native-config)
- 📱 Safe area view [react-native-safe-area-view](https://github.com/react-community/react-native-safe-area-view)
- 🖼️ Fast and performant image loading [react-native-fast-image](https://github.com/DylanVann/react-native-fast-image)
- 🏳️ Typescript enabled internationalization (i18n) via [react-i18next](https://github.com/i18next/react-i18next)
- 🚦 Easy navigation via [react-navigation](https://reactnavigation.org)
- 🗿 Persistence via [async-storage](https://github.com/react-native-async-storage/async-storage)
- 🖥 Running lint & tests on staged git files (pre-commit) via [lint-staged](https://github.com/okonet/lint-staged) and [husky](https://github.com/typicode/husky)
- ♦️ Icons from [material](https://material.io/resources/icons/?style=outline) and [feathericons](https://feathericons.com)
- ℹ️ Styled components testing via [jest-styled-components](https://github.com/styled-components/jest-styled-components)
- ℹ️ Hermes enabled

## Build & Run

Android:

    yarn android

iOS:

    yarn ios

## Storybook

Basic Storybook is set up with support of switching the theme via `knobs` and a custom theme `decorator`.

Run the following and open the app in the simulator/emulator:

    yarn storybook

You may need to commit in the very first line and comment out the rest of the file `/index.js`. This should how the storybook on your emulator/simulator.

Then open `http://localhost:7007` to access the storybook. When using an Android emulator you may need to run `adb reverse tcp:7007 tcp:7007`.
