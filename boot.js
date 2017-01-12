module.exports = (app) => {
  app.listen(app.get('port'), () => {
    console.log(`Test app - Port ${app.get('port')}`);
  });
};
