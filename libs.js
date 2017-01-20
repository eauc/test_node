import bodyParser from 'body-parser';
import morgan from 'morgan';

module.exports = (app) => {
  app.use(bodyParser.json());
  morgan.token('id', (req) => (req.headers['x-id'] || 'N/A'));
  app.use(morgan(':remote-addr - :remote-user [:date[clf]] [:id] ":method :url HTTP/:http-version" :status :res[content-length]'));
};
