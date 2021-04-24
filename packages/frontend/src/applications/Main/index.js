import { CircularProgress, Typography, makeStyles } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';
import { useJsApiLoader } from '@react-google-maps/api';
import Header from '~/components/Header';
import MapView from '~/applications/MapView';
import React from 'react';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  content: {
    flex: 1,
    display: 'flex',
  },
  loading: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const LIBRARIES = ['places'];

const Main = () => {
  const classes = useStyles();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: window.env.GOOGLE_API_KEY,
    libraries: LIBRARIES,
  });

  return (
    <div className={classes.container}>
      <Header />
      <div className={classes.content}>
        {isLoaded && !loadError ? (
          <Switch>
            <Route path="/" component={MapView} />
          </Switch>
        ) : (
          <div className={classes.loading}>
            <Typography
              variant="h3"
              color={loadError ? 'error' : 'textPrimary'}
            >
              {loadError || 'Loading Maps API...'}
            </Typography>
            {!isLoaded && <CircularProgress size={50} color="secondary" />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
