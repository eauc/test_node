module.exports = (app) => {
  app.get('/', indexRoute);
};

function indexRoute(_request_, response) {
  response.json({ name: "server2" });
}
