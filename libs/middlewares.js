import bodyParser from 'body-parser';
import morgan from 'morgan';

module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(morgan('common'));
};
