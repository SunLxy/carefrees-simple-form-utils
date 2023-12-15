
import { defineConfig } from 'saqu';

export default () => defineConfig({
  output: {
    publicPath: './'
  },
  _JS_minifyOptions: {
    dropConsole: false
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: ['@saqu/loader-md-react-preview'],
        type: 'typescript',
      },
    ],
  },
});
