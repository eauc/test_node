import { dispatchRoute } from '../../services/http';

module.exports = (app) => {
  app.get('/', dispatchRoute({
    eventName: 'route-index',
    server: 'server2',
  }));
  app.get('/combined', dispatchRoute({
    eventName: 'route-indexCombined',
    server: 'server2',
  }));
};
