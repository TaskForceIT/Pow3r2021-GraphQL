...

const isWorker = profoundjs.server.listen();
if (isWorker) {
  const express = profoundjs.server.express;
  const app = profoundjs.server.app;
  app.use(express.json());

  // Add the following to your profound-instance:
  Array.isArray(config.webservices) &&
  config.webservices.forEach((element) => {
    try {
      app[element.verb](element.route, profoundjs.express(element.path));
    } catch (e) {
      console.error(
        "HTTP verb '" +
          element.verb +
          "' for module " +
          element.path +
          ' incorrect.'
      );
    }
  });

  ...
