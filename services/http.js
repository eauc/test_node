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
                             _event_, { dispatch }) {
    agent(method, url, data)
      .then((res) => {
        dispatch(R.pipe(
          R.assoc('httpData', res.body),
          R.assoc('httpResponse', res)
        )(onSuccess));
      })
      .catch((error) => {
        if (onError) {
          dispatch(R.pipe(
            R.assoc('httpError', error)
          )(onError));
        }
        else {
          throw error;
        }
      });
  }

  function httpResponseEffect({ status, data }, __event__, { response }) {
    if (status) response.status(status);
    if (data) response.json(data);
  }
};
