module.exports = (app) => {
  const { services: { logger } } = app;
  app.listen(app.get('port'), () => {
    logger('info', `Test app - Port ${app.get('port')}`);
  });
};
