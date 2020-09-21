/* eslint-disable import/no-commonjs */
const path = require("path");

const config = {
  projectName: "we-pet",
  date: "2020-1-15",
  designWidth: 750,
  deviceRatio: {
    "640": 2.34 / 2,
    "750": 1,
    "828": 1.81 / 2
  },
  alias: {
    "@": path.resolve(__dirname, "..", "src/")
  },
  sourceRoot: "src",
  outputRoot: "dist",
  copy: {
    patterns: [
      {
        from: "src/components/vant/dist/wxs/",
        to: "dist/components/vant/dist/wxs/"
      },
      {
        from: "src/components/vant/dist/dropdown-menu/index.wxs",
        to: "dist/components/vant/dist/dropdown-menu/index.wxs"
      },
      {
        from: "src/components/vant/dist/field/index.wxs",
        to: "dist/components/vant/dist/field/index.wxs"
      },
      {
        from: "src/components/vant/dist/checkbox/index.wxs",
        to: "dist/components/vant/dist/checkbox/index.wxs"
      },
      {
        from: "src/components/vant/dist/calendar/index.wxs",
        to: "dist/components/vant/dist/calendar/index.wxs"
      },
      {
        from: "src/components/vant/dist/calendar/calendar.wxml",
        to: "dist/components/vant/dist/calendar/calendar.wxml"
      },
      {
        from: "src/components/vant/dist/calendar/utils.js",
        to: "dist/components/vant/dist/calendar/utils.js"
      },
      {
        from: "src/components/vant/dist/calendar/utils.wxs",
        to: "dist/components/vant/dist/calendar/utils.wxs"
      },
      {
        from: "src/components/vant/dist/calendar/components/month/index.wxs",
        to: "dist/components/vant/dist/calendar/components/month/index.wxs"
      }
    ],
    options: {}
  },
  babel: {
    sourceMap: true,
    presets: [
      [
        "env",
        {
          modules: false
        }
      ]
    ],
    plugins: [
      "transform-decorators-legacy",
      "transform-class-properties",
      "transform-object-rest-spread",
      [
        "transform-runtime",
        {
          helpers: false,
          polyfill: false,
          regenerator: true,
          moduleName: "babel-runtime"
        }
      ]
    ]
  },
  plugins: ["@tarojs/plugin-sass", "@tarojs/plugin-less"],
  defineConstants: {},
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 10240 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]"
        }
      }
    }
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: ["last 3 versions", "Android >= 4.1", "ios >= 8"]
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]"
        }
      }
    }
  }
};

module.exports = function(merge) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
