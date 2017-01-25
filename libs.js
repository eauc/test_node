import bodyParser from 'body-parser';
import morgan from 'morgan';

module.exports = (app) => {
  const { config: { name: server } } = app;
  app.use(bodyParser.json());
  morgan.token('id', (req) => (req.headers['x-id'] || 'N/A'));
  morgan.token('from', (req) => (req.headers['x-from'] || ''));
  app.use(morgan(`:remote-addr - :remote-user [:date[clf]] [:from -> ${server}] [:id] ":method :url HTTP/:http-version" :status :res[content-length]`));
};
