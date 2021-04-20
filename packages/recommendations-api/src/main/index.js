import { config } from '../../config';
import { loadSchema } from '../schema';
import { ApolloServer } from 'apollo-server';

export const main = async () => {
  console.log('Starting Recommendations API...');
  const server = new ApolloServer({ schema: await loadSchema() });
  const listen = await server.listen({
    port: config.get('http.listening.port'),
  });
  console.log(`Recommendations API ready at ${listen.url}`);
};
