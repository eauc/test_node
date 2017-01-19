module.exports = (app) => {
  const {
    services: { http: { dispatchRoute } },
    config: { name },
  } = app;

  app.get('/', dispatchRoute({
    eventName: 'route-index',
    server: name,
  }));

  app.get('/combined', dispatchRoute({
    eventName: 'route-indexCombined',
    server: name,
  }));
};
