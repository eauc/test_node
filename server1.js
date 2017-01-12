import express from 'express';
import consign from 'consign';

const app = express();

consign({
  verbose: process.env.NODE_ENV !== 'production',
}).include('config.js')
  .then('libs')
  .then('routes/server1')
  .then('handlers')
  .then('services/http.js')
  .then('boot.js')
  .into(app);
