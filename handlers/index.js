import R from 'ramda';
import { registerHandler } from '../services/state';
import { effects } from '../middlewares/effects';

module.exports = () => {
  registerHandler('route-index', [effects], routeIndexHandler);
  registerHandler('route-indexWithOtherServer', routeIndexWithOtherServerHandler);
};

function routeIndexHandler(_state_, event) {
  const { response, server } = event;
  if ('server1' === server) {
    return {
      http: {
        method: 'GET',
        url: 'http://localhost:3051',
        onSuccess: R.assoc('eventName', 'route-indexWithOtherServer', event),
      },
    };
  }
  return response.json({ server });
}

function routeIndexWithOtherServerHandler(_state_,
                                          { response, server, httpData }) {
  return response.json({
    server,
    other: httpData,
  });
}
