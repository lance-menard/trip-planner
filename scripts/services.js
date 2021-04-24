const fetch = require('cross-fetch');
const VError = require('verror');

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
      throw new VError(await response.text());
    }

    if (response.status >= 400) {
      throw new VError({ info: result }, response.statusText);
    }

    if (result.errors) {
      throw new VError(
        { info: { errors: result.errors } },
        result.errors[0].message
      );
    }

    return result;
  },
});

module.exports.graphql = createGraphQLService(
  'http://localhost:8088/v1/graphql'
);
module.exports.maps = createGraphQLService('http://localhost:4001');
module.exports.recommendations = createGraphQLService('http://localhost:4002');
