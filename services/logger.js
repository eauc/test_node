import R from 'ramda';
import winston from 'winston';

module.exports = ({ config: { name } }) => {
  const defaultLogger = create();

  return {
    create,
    default: defaultLogger,
  };

  function create(label) {
    const loggerInstance = new (winston.Logger)({
      transports: [
        new winston.transports.Console({
          colorize: 'all',
          label: R.join('.', R.reject(R.isNil, [name, label])),
          level: 'debug',
        }),
      ],
    });

    return function logger(...args) {
      loggerInstance.log(...args);
    };
  }
};
