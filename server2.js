import express from 'express';
import consign from 'consign';

const app = express();

consign({
  verbose: process.env.NODE_ENV !== 'production'
}).include('config.js')
  .then('libs')
  .then('services')
  .then('routes/server2')
  .then('boot.js')
  .into(app);
