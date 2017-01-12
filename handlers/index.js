import { registerHandler } from '../services/state';

module.exports = () => {
  registerHandler('route-index', routeIndexHandler);
};

function routeIndexHandler(_state_, { response, server }) {
  response.json({ server });
}
