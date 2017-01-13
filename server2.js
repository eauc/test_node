import express from 'express';
import consign from 'consign';

const app = express();

consign({
  verbose: process.env.NODE_ENV !== 'production',
}).include('config.js')
  .then('libs.js')
  .then('models')
  .then('services/logger.js')
  .then('services/state.js')
  .then('middlewares')
  .then('services/http.js')
  .then('handlers')
  .then('routes/server2')
  .then('boot.js')
  .into(app);
