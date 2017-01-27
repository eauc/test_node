import R from 'ramda';
import bodyParser from 'body-parser';
import winston from 'winston';
import expressWinston from 'express-winston';

module.exports = (app) => {
  const { config: { name: server } } = app;
  app.use(bodyParser.json());
  // ':remote-addr - :remote-user [:xtime] [:fromTo] [:id] ":method :url HTTP/:http-version" :status :res[content-length]';
  expressWinston.requestWhitelist.push('ip');
  expressWinston.requestWhitelist.push('hostname');
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        formatter: ({ level, message, meta: { req, res } }) => {
          const from = R.pathOr('external', ['headers','x-from'], req);
          const id = R.pathOr('N/A', ['headers','x-id'], req);
          return `${req.ip} - ${req.hostname} [${logTime()}] ${level.toUpperCase()} [${from}->${server}] [${id}] ${message} ${JSON.stringify({ req, res })}`;
        },
        colorize: 'all',
      }),
    ],
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} [{{res.statusCode}}] {{res.responseTime}}ms',
    statusLevels: true,
  }));
};

function logTime() {
  return (new Date()).toISOString();
}
