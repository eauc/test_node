module.exports = (app) => {
  const {
    services: {
      logger: { default: logger },
      state: { dispatch },
    },
  } = app;

  app.listen(app.get('port'), () => {
    logger('info', `Test app - Port ${app.get('port')}`);
    dispatch({ eventName: 'state-init' });
  });
};
