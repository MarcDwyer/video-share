const httpProxy = require("http-proxy");
const proxy = httpProxy.createServer({ target: "http://localhost:1337" });

module.exports = {
  plugins: ["@snowpack/plugin-react-refresh", "@snowpack/plugin-sass"],
  routes: [
    {
      src: "/video",
      dest: (req, res) => {
        console.log(req);
        // remove /api prefix (optional)
        req.url = req.url.replace(/^\/video/, "");

        proxy.web(req, res);
      },
    },
  ],
};
