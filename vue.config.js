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
      return {
        plugins: [
          new PrerenderSPAPlugin({
            staticDir: path.join(__dirname, "dist"),
            routes: [
              "/",
              "/about",
              ...posts.map(p => `/posts/${p.Page}`),
              ...daily.map(d => `/daily/${d.Page}`)
            ],
          })
        ]
      };
    }
  }
}
