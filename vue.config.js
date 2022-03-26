const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // devServer: {
  //   proxy: {
  //     [process.env.VUE_APP_BASE_API]: {
  //       target: process.env.VUE_APP_BASE_URL,
  //       changeOrigin: true,
  //       pathRewrite: {
  //         ['^' + process.env.VUE_APP_BASE_API]: '/',
  //       },
  //     },
  //   },
  // },
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'System Services List',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
  },
})
