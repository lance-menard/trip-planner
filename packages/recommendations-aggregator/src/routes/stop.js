import { find, intersection, propEq } from 'ramda';
import { graphql, maps } from '../util/services';

const TRACKED_PLACE_TYPES = [
  'amusement_park',
  'aquarium',
  'art_gallery',
  'book_store',
  'campground',
  'casino',
  'museum',
  'night_club',
  'park',
  'restaurant',
  'shopping_mall',
  'zoo',
];

const getPlaceTypes = async (placeId) => {
  const result = await maps.graphQL({
    query: /* GraphQL */ `
      query GetPlace($id: String!) {
        place(id: $id) {
          types
        }
      }
    `,
    variables: {
      id: placeId,
    },
  });

  const placeTypes = result.data.place.types;

  return intersection(placeTypes, TRACKED_PLACE_TYPES);
};

const getTripUser = async (tripId) => {
  const result = await graphql.graphQL({
    query: /* GraphQL */ `
      query GetTrip($id: Int!) {
        trip_by_pk(id: $id) {
          user_id
        }
      }
    `,
    variables: {
      id: tripId,
    },
  });

  return result.data.trip_by_pk.user_id;
};

const getUserPlaceTypes = async (userId, placeTypes) => {
  const result = await graphql.graphQL({
    query: /* GraphQL */ `
      query GetTrip($userId: Int!, $placeTypes: [String!]!) {
        user_place_type(
          where: { user_id: { _eq: $userId }, place_type: { _in: $placeTypes } }
        ) {
          id
          place_type
          occurrences
        }
      }
    `,
    variables: {
      userId,
      placeTypes,
    },
  });

  return result.data.user_place_type;
};

const updateUserPlaceTypes = async ({ create, update, amount }) =>
  graphql.graphQL({
    query: /* GraphQL */ `
      mutation UpdateUserPlaces(
        $create: [user_place_type_insert_input!]!
        $update: [Int!]!
        $amount: Int!
      ) {
        insert_user_place_type(objects: $create) {
          affected_rows
        }

        update_user_place_type(
          _inc: { occurrences: $amount }
          where: { id: { _in: $update } }
        ) {
          affected_rows
        }
      }
    `,
    variables: {
      create,
      update,
      amount,
    },
  });

const incrementUserPlaceTypes = async (
  { place_id: placeId, trip_id: tripId },
  increment
) => {
  const userId = await getTripUser(tripId);
  const types = await getPlaceTypes(placeId);
  const userPlaceTypes = await getUserPlaceTypes(userId, types);

  const create = [];
  const update = [];

  for (const type of types) {
    const existingRecord = find(propEq('place_type', type), userPlaceTypes);
    if (existingRecord) {
      update.push(existingRecord.id);
    } else {
      create.push({
        user_id: userId,
        place_type: type,
        occurrences: increment ? 1 : 0,
      });
    }
  }

  await updateUserPlaceTypes({
    create,
    update,
    amount: increment ? 1 : -1,
  });
};

export default {
  INSERT: async ({
    event: {
      data: { new: newData },
    },
  }) => incrementUserPlaceTypes(newData, true),
  UPDATE: async ({
    event: {
      data: { old: oldData, new: newData },
    },
  }) => {
    if (oldData.place_id !== newData.place_id) {
      await incrementUserPlaceTypes(newData, true);
      await incrementUserPlaceTypes(oldData, false);
    }
  },
  DELETE: async ({
    event: {
      data: { old: oldData },
    },
  }) => incrementUserPlaceTypes(oldData, false),
};
