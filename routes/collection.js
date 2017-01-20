module.exports = (app) => {
  const {
    services: { http: { dispatchRoute } },
    config: { name },
  } = app;

  app.get('/collection', dispatchRoute({
    eventName: 'route-collectionList',
  }));
  app.get('/collection/combined', dispatchRoute({
    eventName: 'route-collectionListCombined',
    server: name,
  }));

  app.post('/collection', dispatchRoute({
    eventName: 'route-collectionCreate',
  }));

  app.get('/collection/:id', dispatchRoute({
    eventName: 'route-collectionFind',
  }));
  app.get('/collection/combined/:id', dispatchRoute({
    eventName: 'route-collectionFindCombined',
    server: name,
  }));

  app.put('/collection/:id', dispatchRoute({
    eventName: 'route-collectionUpdate',
  }));
  app.put('/collection/combined/:id', dispatchRoute({
    eventName: 'route-collectionUpdateCombined',
    server: name,
  }));

  app.delete('/collection/:id', dispatchRoute({
    eventName: 'route-collectionRemove',
  }));
  app.delete('/collection/combined/:id', dispatchRoute({
    eventName: 'route-collectionRemoveCombined',
    server: name,
  }));
};
