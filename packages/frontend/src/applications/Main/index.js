import { Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
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
  },
}));

const Main = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Header />
      <div className={classes.content}>
        <Switch>
          <Route path="/" component={MapView} />
        </Switch>
      </div>
    </div>
  );
};

export default Main;
