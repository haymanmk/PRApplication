// const withPWA = require("next-pwa");

// module.exports = withPWA({
//   // reactStrictMode: true,
//   pwa: {
//     dest: "public",
//     sw: "service-worker.js",
//   },
//   webpack: (config, { dev, isServer }) => {
//     if (!dev && !isServer) {
//       config.resolve.alias["react"] = "react";
//       config.resolve.alias["react-dom"] = "react-dom";
//     }
//     return config;
//   },
// });

module.exports = {
  reactStrictMode: false,
};
