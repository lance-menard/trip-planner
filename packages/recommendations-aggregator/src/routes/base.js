import { path } from 'ramda';
import stop from './stop';

const HANDLERS = {
  stop,
};

export default async (request, response) => {
  const {
    body,
    body: {
      table: { name: tableName },
      event: { op },
    },
  } = request;

  const handler = path([tableName, op], HANDLERS);

  if (handler) {
    try {
      await handler(body);
      response.send(204);
    } catch (e) {
      console.error(e);
      response.send(500, e);
    }
  } else {
    response.send(204);
  }
};
