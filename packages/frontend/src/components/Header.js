import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import PropTypes from 'prop-types';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginLeft: 0,
  },
  hide: {
    display: 'none',
  },
  toolbar: {
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'space-between',
    ...theme.mixins.toolbar,
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  toolbarRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  titleText: {
    fontSize: '1.875rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
  titleContainer: {
    marginLeft: '15px',
  },
  logo: {
    height: '44px',
    verticalAlign: 'bottom',
  },
}));

const Header = () => {
  const classes = useStyles();

  return (
    <AppBar className={classes.appBar} position="relative">
      <Toolbar className={classes.toolbar}>
        <div className={classes.toolbarLeft}>
          {/* <Link to="/">
          <Logo
                className={classes.logo}
                size="small"
              />
        </Link> */}
          <Hidden smDown>
            <div className={classes.titleContainer} key="pageTitle">
              <Typography variant="h1" className={classes.titleText}>
                Trip Planner
              </Typography>
            </div>
          </Hidden>
        </div>
        <div className={classes.toolbarRight}>{/* <AvatarMenu /> */}</div>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {};

Header.defaultProps = {};

export default Header;
