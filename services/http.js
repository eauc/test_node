import R from 'ramda';
const agent = require('superagent-promise')(require('superagent'), Promise);

module.exports = ({
  middlewares: { effects: { registerEffect } },
  services: { state: { dispatch } },
}) => {
  registerEffect('httpRequest', httpRequestEffect);
  registerEffect('httpResponse', httpResponseEffect);

  return {
    dispatchRoute,
  };

  function dispatchRoute(event) {
    return (request, response) => {
      const routeDispatch = (event) => {
        dispatch(event, {
          dispatch: routeDispatch,
          request,
          response,
        });
      };
      routeDispatch(event);
    };
  }

  function httpRequestEffect({ method, url, data, onSuccess, onError },
                             _event_, { dispatch, request }) {
    const id = R.pathOr(
      'N/A',
      ['headers','x-id'],
      request
    );
    agent(method, url)
      .set('x-id', id)
      .send(data)
      .then((res) => {
        dispatch(R.pipe(
          R.assoc('httpData', res.body),
          R.assoc('httpStatus', res.status),
          R.assoc('httpResponse', res)
        )(onSuccess));
      })
      .catch((res) => {
        if (onError) {
          dispatch(R.pipe(
            R.assoc('httpStatus', res.status),
            R.assoc('httpResponse', res)
          )(onError));
        }
        else {
          throw new Error('httpRequest error : no handler');
        }
      });
  }

  function httpResponseEffect({ status, data }, __event__, { response }) {
    if (status) response.status(status);
    if (data) response.json(data);
  }
};
