import { CircularProgress, Typography, makeStyles } from '@material-ui/core';
import { Marker } from '@react-google-maps/api';
import { gql, useQuery } from '@apollo/client';
import { path } from 'ramda';
import { useSelector } from 'react-redux';
import Map from '~/components/Map';
import Paper from '@material-ui/core/Paper';
import React from 'react';

const useStyles = makeStyles({
  map: {
    height: '100%',
  },
});

const GET_TRIP = gql`
  query GetTrip($id: Int!) {
    trip: trip_by_pk(id: $id) {
      id
      title
      stops {
        id
        name
        order
        place {
          location {
            lat
            lng
          }
        }
      }
    }
  }
`;

const MapViewAdapter = () => {
  const classes = useStyles();
  const {
    loading,
    error,
    data: { trip },
  } = useQuery(GET_TRIP, {
    variables: { id: 1 },
  });

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography>{error.message}</Typography>;
  }

  return (
    <Map className={classes.map}>
      {trip.stops.map(({ name, place: { location } }) => (
        <Marker position={location} label={name} />
      ))}
    </Map>
  );
};

MapViewAdapter.propTypes = {};

export default MapViewAdapter;
