import R from 'ramda';
import { dispatch } from './state';
import { registerEffect } from '../middlewares/effects';
const agent = require('superagent-promise')(require('superagent'), Promise);

module.exports = () => {
  registerEffect('httpRequest', httpRequestEffect);
  registerEffect('httpResponse', httpResponseEffect);
};
module.exports.dispatchRoute = dispatchRoute;

function dispatchRoute(event) {
  return (request, response) => {
    console.log('dispatch-routing');
    const routeDispatch = (event) => {
      console.log('routeDispatch', event);
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
