import { dispatch } from '../../services/state';

module.exports = (app) => {
  app.get('/', indexRoute);
};

function indexRoute(request, response) {
  dispatch({
    eventName: 'route-index',
    request, response,
    server: 'server2',
  });
}
