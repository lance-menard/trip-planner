import { SCALAR_MAP } from './constants';
import { applyMiddleware } from 'graphql-middleware';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import { resolve } from 'path';
import middlewares from '../middlewares';
import resolvers from '../resolvers';

export const loadSchema = async () =>
  applyMiddleware(
    makeExecutableSchema({
      typeDefs: await importSchema(resolve(__dirname, 'types/index.graphql')),
      resolvers: {
        ...resolvers,
        ...SCALAR_MAP,
      },
    }),
    ...middlewares
  );
