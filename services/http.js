import R from 'ramda';
import { dispatch } from './state';
import { registerEffect } from '../middlewares/effects';
const agent = require('superagent-promise')(require('superagent'), Promise);

module.exports = () => {
  registerEffect('http', httpEffect);
};

function httpEffect({ method, url, data, onSuccess, onError }) {
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
