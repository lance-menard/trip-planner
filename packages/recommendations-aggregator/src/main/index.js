import { config } from '../../config';
import { name, version } from '../../package.json';
import base from '../routes/base';
import restify from 'restify';

export const main = async () => {
  console.log('Starting Recommendations Aggregator...');

  const server = restify.createServer({
    name,
    version,
  });

  server.use(restify.plugins.acceptParser(server.acceptable));
  server.use(restify.plugins.queryParser());
  server.use(restify.plugins.bodyParser());

  server.post('/', async (req, res, next) => next(await base(req, res)));

  server.listen(config.get('http.listening.port'), () => {
    console.log('%s listening at %s', server.name, server.url);
  });
};
