const ports = {
  server1: 3050,
  server2: 3051,
};

module.exports = (app) => {
  const name = process.env.NAME;
  app.set('port', process.env.PORT || ports[name]);

  return {
    name,
    otherPort: ports[name === 'server1' ? 'server2' : 'server1'],
  };
};
