module.exports = (app) => {
  const { services: { http: { dispatchRoute } } } = app;

  app.get('/collection', dispatchRoute({
    eventName: 'route-collectionList',
  }));

  app.post('/collection', dispatchRoute({
    eventName: 'route-collectionCreate',
  }));

  app.get('/collection/:id', dispatchRoute({
    eventName: 'route-collectionFind',
  }));

  app.put('/collection/:id', dispatchRoute({
    eventName: 'route-collectionUpdate',
  }));

  app.delete('/collection/:id', dispatchRoute({
    eventName: 'route-collectionRemove',
  }));
};
