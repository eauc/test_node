import agent from '../../services/agent';

module.exports = (app) => {
  app.get('/', indexRoute);
};

function indexRoute(_request_, response) {
  agent('GET', 'http://localhost:3051/')
		.then((response2) => {
			response.json({
				name: "server1",
				server2: response2.body,
			});
		});
}
