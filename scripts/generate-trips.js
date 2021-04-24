#!/usr/bin/env node
const _ = require('lodash');
const chalk = require('chalk');
const yargs = require('yargs');
const { graphql } = require('./services');
const { pluck } = require('ramda');

const log = (str) => console.log(`${chalk.yellow('[generate-trips]')} ${str}`);

const METRO_AREAS = {
  detroit: {
    id: 'ChIJdR3LEAHKJIgR0sS5NU6Gdlc',
    name: 'Detroit',
    location: { lat: 42.331802618950306, lng: -83.04663424197977 },
  },
  ann_arbor: {
    id: 'ChIJMx9D1A2wPIgR4rXIhkb5Cds',
    name: 'Ann Arbor',
    location: { lat: 42.27414122171555, lng: -83.73031295807718 },
  },
  grand_rapids: {
    id: 'ChIJFShQu2BUGIgR0KjTG8uqk6U',
    name: 'Grand Rapids',
    location: { lat: 42.96869085894933, lng: -85.66797358491408 },
  },
  chicago: {
    id: 'ChIJ7cv00DwsDogRAMDACa2m4K8',
    name: 'Chicago',
    location: { lat: 41.880400582785015, lng: -87.63120286891066 },
  },
  los_angeles: {
    id: 'ChIJE9on3F3HwoAR9AhGJW_fL-I',
    name: 'Los Angeles',
    location: { lat: 34.05855168117099, lng: -118.2582039754451 },
  },
  new_york: {
    id: 'ChIJOwg_06VPwokRYv534QaPC8g',
    name: 'New York City',
    location: { lat: 40.72789204452405, lng: -73.9958666827072 },
  },
  washington_dc: {
    id: 'ChIJW-T2Wt7Gt4kRKl2I1CJFUsI',
    name: 'Washington, D.C.',
    location: { lat: 38.8912185763428, lng: -77.03740045168635 },
  },
  atlanta: {
    id: 'ChIJjQmTaV0E9YgRC2MLmS_e_mY',
    name: 'Atlanta',
    location: { lat: 33.75439131082528, lng: -84.3876836502352 },
  },
  dallas: {
    id: 'ChIJS5dFe_cZTIYRj2dH9qSb7Lk',
    name: 'Dallas',
    location: { lat: 32.777278158693875, lng: -96.79695684020867 },
  },
  phoenix: {
    id: 'ChIJy3mhUO0SK4cRrBtKNfjHaYw',
    name: 'Phoenix',
    location: { lat: 33.452220542126845, lng: -112.08317090397327 },
  },
  seattle: {
    id: 'ChIJVTPokywQkFQRmtVEaUZlJRA',
    name: 'Seattle',
    location: { lat: 47.611182896223575, lng: -122.33107254091868 },
  },
  portland: {
    id: 'ChIJJ3SpfQsLlVQRkYXR9ua5Nhw',
    name: 'Portland',
    location: { lat: 45.505176893459364, lng: -122.66995836964558 },
  },
  san_francisco: {
    id: 'ChIJIQBpAG2ahYAR_6128GcTUEo',
    name: 'San Francisco',
    location: { lat: 37.776375148875644, lng: -122.41813783688855 },
  },
};

const generateTrips = async ({ userId, count, stopsPerTrip, metroArea }) => {
  let userIds = null;

  if (userId) {
    userIds = [userId];
  } else {
    const {
      data: { user },
    } = await graphql.graphQL({
      query: /* GraphQL */ `
        query {
          user {
            id
          }
        }
      `,
    });

    userIds = pluck('id', user);
  }

  for (const user_id of userIds) {
    for (let tripIndex = 0; tripIndex < count; tripIndex++) {
      log(`Generating trip ${tripIndex + 1} of ${count} for user ${userId}...`);
      const now = Date.now();

      // Select a starting metro area at random.
      const startingLocation =
        metroArea || _.shuffle(Object.keys(METRO_AREAS))[0];
      const metroAreaPlace = METRO_AREAS[startingLocation];

      // Insert the trip.
      const {
        data: {
          trip: { id: trip_id },
        },
      } = await graphql.graphQL({
        query: /* GraphQL */ `
          mutation CreateTrip($create: trip_insert_input!) {
            trip: insert_trip_one(object: $create) {
              id
            }
          }
        `,
        variables: {
          create: {
            user_id,
            title: `Generated ${metroAreaPlace.name} trip ${tripIndex + 1}`,
          },
        },
      });

      const {
        data: { recommendations },
      } = await graphql.graphQL({
        query: /* GraphQL */ `
          query GetRecommendations(
            $user_id: Int!
            $location: LatLngInput!
            $resultsPerType: Int!
          ) {
            recommendations(
              userId: $user_id
              location: $location
              resultsPerType: $resultsPerType
              radius: 50000
            ) {
              id
              name
            }
          }
        `,
        variables: {
          user_id,
          location: metroAreaPlace.location,
          resultsPerType: stopsPerTrip,
        },
      });

      // Pick stops at random.
      const stops = [
        metroAreaPlace,
        ..._.shuffle(recommendations).slice(0, stopsPerTrip - 1),
      ];

      // Insert stops.
      await graphql.graphQL({
        query: /* GraphQL */ `
          mutation CreateStop($create: [stop_insert_input!]!) {
            stop: insert_stop(objects: $create) {
              affected_rows
            }
          }
        `,
        variables: {
          create: stops.map(({ id, name }, index) => ({
            trip_id,
            name,
            order: index,
            place_id: id,
          })),
        },
      });

      log(`Generated trip ${tripIndex + 1} in ${Date.now() - now}ms.`);
    }
  }
};

yargs
  .scriptName('generate-trips')
  .command(
    '$0 [userId] [count] [stopsPerTrip]',
    'Generates trips.',
    (yargs) => {
      yargs
        .options('userId', {
          type: 'number',
          describe:
            'The user to generate trips for; when not supplied, will generate trips for all users.',
        })
        .options('count', {
          type: 'number',
          describe: 'The number of trips to generate.',
          default: 1,
        })
        .options('stopsPerTrip', {
          type: 'number',
          describe: 'The number of stops to generate per trip.',
          default: 5,
        })
        .options('metroArea', {
          type: 'string',
          describe:
            'The metro area for the trips; when not supplied, one will be selected at random.',
        });
    },
    generateTrips
  )
  .help().argv;
