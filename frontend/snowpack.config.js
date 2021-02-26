const httpProxy = require("http-proxy");
const proxy = httpProxy.createServer({ target: "http://localhost:1337" });

module.exports = {
  plugins: ["@snowpack/plugin-react-refresh", "@snowpack/plugin-sass"],
  routes: [
    {
      src: "/video/create",
      dest: (req, res) => {
        // remove /api prefix (optional)
        // req.url = req.url.replace(/^\/video/, "");
        proxy.web(req, res, { target: "http://localhost:1337" });
      },
    },
    { match: "routes", src: ".*", dest: "/index.html" },
  ],
};
