import { Add, Delete, DragHandle } from '@material-ui/icons';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Marker } from '@react-google-maps/api';
import { gql, useMutation, useQuery } from '@apollo/client';
import { path } from 'ramda';
import { setSelectedTrip as setSelectedTripAction } from '../actions';
import { useDispatch, useSelector } from 'react-redux';
import Map from '~/components/Map';
import PlaceSelectInput from '~/components/PlaceSelectInput';
import React, { useCallback, useEffect, useRef } from 'react';
import TripSelectInput from '~/components/TripSelectInput';

const DRAWER_WIDTH = 320;

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    flex: 1,
  },
  drawer: {
    display: 'flex',
    flexShrink: 0,
    marginTop: '64px',
    width: DRAWER_WIDTH,
    position: 'relative',
  },
  drawerPaper: {
    width: DRAWER_WIDTH,
  },
  drawerContainer: {
    // padding: theme.spacing(),
  },
  drawerElement: {
    margin: theme.spacing(2),
  },
  map: {
    flexGrow: 1,
    height: '100%',
    display: 'flex',
  },
}));

const GET_TRIP = gql`
  query GetTrip($id: Int!) {
    trip: trip_by_pk(id: $id) {
      id
      title
      stops(order_by: { order: asc }) {
        id
        name
        order
        place {
          name
          url
          location {
            lat
            lng
          }
        }
      }
    }
  }
`;

const ADD_TRIP = gql`
  mutation CreateTrip($create: trip_insert_input!) {
    trip: insert_trip_one(object: $create) {
      id
      title
    }
  }
`;

const MapViewAdapter = () => {
  const classes = useStyles();

  const userId = useSelector(path(['mapView', 'userId']));
  const selectedTrip = useSelector(path(['mapView', 'selectedTrip']));
  const dispatch = useDispatch();

  const { loading, error, data: { trip } = {} } = useQuery(GET_TRIP, {
    variables: { id: selectedTrip?.id },
    skip: !selectedTrip || selectedTrip.newTrip,
  });

  const [addTrip] = useMutation(ADD_TRIP);

  const handleSelectedTripChanged = useCallback(async (event, selectedTrip) => {
    const { newTrip, inputValue } = selectedTrip;

    if (newTrip) {
      const {
        data: { trip },
      } = await addTrip({
        variables: { create: { title: inputValue, user_id: userId } },
      });

      dispatch(setSelectedTripAction({ selectedTrip: trip }));
    } else {
      dispatch(setSelectedTripAction({ selectedTrip }));
    }
  });

  const map = useRef();
  const onMapLoad = useCallback((mapInstance) => {
    map.current = mapInstance;
  });

  // Pan the map to the trip start when a new trip is selected
  useEffect(() => {
    if (map.current && trip && trip.stops[0]) {
      map.current.panTo(trip.stops[0].place.location);
    }
  }, [map, trip]);

  return (
    <div className={classes.wrapper}>
      <Drawer
        variant="permanent"
        anchor="left"
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <TripSelectInput
            className={classes.drawerElement}
            userId={userId}
            onChange={handleSelectedTripChanged}
            value={selectedTrip}
          />
          {/* Delete button */}
          {/* Way to edit name? */}
          {loading && <CircularProgress />}
          {error && <Typography color="error">{error.message}</Typography>}
          {trip?.stops
            ? trip.stops.map(({ name, place }, index) => (
                <Card className={classes.drawerElement}>
                  <CardHeader
                    title={name}
                    subheader={`Stop ${index + 1} of ${trip.stops.length}`}
                    action={<DragHandle />}
                  />
                  <CardContent>
                    <PlaceSelectInput
                      value={place}
                      onChange={(value) => console.log(value)}
                      label="Stop"
                    />
                  </CardContent>
                  <CardActions>
                    <IconButton aria-label="delete stop">
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              ))
            : null}
          {trip ? (
            <Card className={classes.drawerElement}>
              <CardHeader subheader="Add Stop" />
              <CardContent>
                <PlaceSelectInput
                  onChange={(value) => console.log(value)}
                  label="Stop"
                />
              </CardContent>
              <CardActions>
                <IconButton aria-label="add stop">
                  <Add />
                </IconButton>
              </CardActions>
            </Card>
          ) : null}
        </div>
      </Drawer>
      <Map className={classes.map} onLoad={onMapLoad}>
        {trip
          ? trip.stops.map(({ name, place: { location } }) => (
              <Marker position={location} label={name} />
            ))
          : null}
      </Map>
    </div>
  );
};

MapViewAdapter.propTypes = {};

export default MapViewAdapter;
