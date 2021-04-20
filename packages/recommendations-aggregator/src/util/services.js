import { config } from '../../config';
import VError from 'verror';
import fetch from 'cross-fetch';

const serviceUrls = config.get('services');

const createGraphQLService = (url) => ({
  graphQL: async ({ query, variables }) => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        query,
        variables,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let result = null;

    try {
      result = await response.json();
    } catch {
      throw new Error(await response.text());
    }

    if (response.status >= 400) {
      throw new VError({ info: result }, response.statusText);
    }

    if (result.errors) {
      throw new Error(
        { info: { errors: result.errors } },
        result.errors[0].message
      );
    }

    return result;
  },
});

export const graphql = createGraphQLService(serviceUrls.graphql);
export const maps = createGraphQLService(serviceUrls.maps);
