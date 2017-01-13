import R from 'ramda';
import { dispatch } from './state';
import { registerEffect } from '../middlewares/effects';
const agent = require('superagent-promise')(require('superagent'), Promise);

module.exports = () => {
  registerEffect('httpRequest', httpRequestEffect);
  registerEffect('httpResponse', httpResponseEffect);
};

function httpRequestEffect({ method, url, data, onSuccess, onError },
                           { request, response }) {
  agent(method, url, data)
    .then((res) => {
      console.log('onSuccess', onSuccess, res.body);
      dispatch(R.pipe(
        R.assoc('request', request),
        R.assoc('response', response),
        R.assoc('httpData', res.body),
        R.assoc('httpResponse', res)
      )(onSuccess));
    })
    .catch((error) => {
      if (onError) {
        dispatch(R.pipe(
          R.assoc('request', request),
          R.assoc('response', response),
          R.assoc('httpError', error)
        )(onError));
      }
      else {
        throw error;
      }
    });
}

function httpResponseEffect({ status, data }, { response }) {
  if (status) response.status(status);
  if (data) response.json(data);
}
