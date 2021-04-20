import { descend, pipe, prop, sortBy, sortWith, uniqBy } from 'ramda';
import { graphql, maps } from '../../util/services';

const getPlaces = async ({ location, radius, type }) => {
  const {
    data: { places },
  } = await maps.graphQL({
    query: /* GraphQL */ `
      query GetPlacesNearby(
        $location: LatLngInput!
        $radius: Int
        $type: PlaceType
      ) {
        places(location: $location, radius: $radius, type: $type) {
          id
          name
          url
          types
          rating
          location {
            lat
            lng
          }
          data
        }
      }
    `,
    variables: {
      location,
      radius,
      type: type ? type.toUpperCase() : type,
    },
  });

  return places || [];
};

export const recommendations = async (
  parent,
  { userId, location, radius, locationTypes = 3, resultsPerType = 3 }
) => {
  // Get the user's top types
  const {
    data: { user_place_types: types },
  } = await graphql.graphQL({
    query: /* GraphQL */ `
      query UserPlaceTypes($userId: Int!, $limit: Int!) {
        user_place_types(
          limit: $limit
          where: { user_id: { _eq: $userId } }
          order_by: { occurrences: desc_nulls_last }
        ) {
          place_type
          occurrences
        }
      }
    `,
    variables: {
      userId,
      limit: locationTypes,
    },
  });

  const allPlaces = [];

  // Query a set of places not included in the user's preferences to add variety to the list
  const places = await getPlaces({
    location,
    radius,
    type: 'tourist_attraction',
  });
  allPlaces.push(...places.slice(0, resultsPerType));

  // Query top places for each of the user's top types
  for (const { place_type: type } of types) {
    const places = await getPlaces({ location, radius, type });
    allPlaces.push(...places.slice(0, resultsPerType));
  }

  return pipe(
    uniqBy(prop('id')),
    // TODO: Consider interleaving by index to retain Google's "prominence" rating
    // TODO: Consider adding "recommended because" type field (i.e. "Recommended because you like parks")
    sortWith([descend(prop('rating'))])
  )(allPlaces);
};
