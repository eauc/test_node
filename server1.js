import express from 'express';
import consign from 'consign';

const app = express();

consign({
  verbose: process.env.NODE_ENV !== 'production',
}).include('config.js')
  .then('libs.js')
  .then('services/logger.js')
  .then('middlewares')
  .then('services/state.js')
  .then('services/http.js')
  .then('handlers')
  .then('routes')
  .then('boot.js')
  .into(app);
