const path = require("path");
const PrerenderSPAPlugin = require("prerender-spa-plugin-next");
const posts = require("./src/post-data.json");
const daily = require("./src/life-data.json");
module.exports = {
    chainWebpack: config => {
        config.module.rules.delete('eslint');
    },
    publicPath: '/',
    outputDir: 'docs',
    devServer: {
        port: process.env.VUE_APP_PORT || 8080
    },
    pluginOptions: {
        sitemap: {
            urls: [
                'https://devwue.github.io/home',
                'https://devwue.github.io/about',
            ]
        }
    },configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      cleanName = function(markdownPage) {
        return markdownPage.replace(/\.md$/,'')
      }
      return {
        plugins: [
          new PrerenderSPAPlugin({
            staticDir: path.join(__dirname, "dist"),
            routes: [
              "/",
              "/about",
              ...posts.map(p => `/posts/${cleanName(p.Page)}`),
              ...daily.map(p => `/daily/${cleanName(p.Page)}`)
            ],
          })
        ]
      };
    }
  }
}
