module.exports = {
  env: {
    NODE_ENV: '"development"',
    HTTP_DOMAIN: 'http://wc3.test.com',
    APP_SOURCE: 3,
    LOGIN_PAGE: '/pages/login',
  },
  defineConstants: {},
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true
        },
        // 小程序端样式引用本地资源内联配置
        url: {
          enable: true,
          config: {
            limit: 10240 // 文件大小限制
          }
        }
      }
    }
  },
  h5: {}
}
