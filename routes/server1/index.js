import { dispatchRoute } from '../../services/http';

module.exports = (app) => {
  app.get('/', dispatchRoute({
    eventName: 'route-index',
    server: 'server1',
  }));
  app.get('/combined', dispatchRoute({
    eventName: 'route-indexCombined',
    server: 'server1',
  }));
};
