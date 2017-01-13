module.exports = (app) => {
  const dispatchRoute = app.services.http.dispatchRoute;
  app.get('/', dispatchRoute({
    eventName: 'route-index',
    server: 'server2',
  }));
  app.get('/combined', dispatchRoute({
    eventName: 'route-indexCombined',
    server: 'server2',
  }));
};
