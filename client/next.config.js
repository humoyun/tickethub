module.exports = {
  webpackDevMiddleware: config => {
    // next has some watch file changes issues when is run inside docker container (k8s cluster)
    config.watchOptions.poll = 300;
    return config;
  }
};
