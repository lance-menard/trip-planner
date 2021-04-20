import { CircularProgress, Typography } from '@material-ui/core';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { mergeDeepRight } from 'ramda';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

const getStandardOptions = () => ({
  zoomControlOptions: {
    /* global google */
    position: google.maps.ControlPosition.RIGHT_CENTER,
    // ...other options
  },
});

const Map = ({ children, className, options, onLoad }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: window.env.GOOGLE_API_KEY,
  });

  const computedOptions = useMemo(
    () => (isLoaded ? mergeDeepRight(getStandardOptions(), options) : {}),
    [options, isLoaded]
  );

  if (loadError) {
    return <Typography>Map cannot be loaded right now, sorry.</Typography>;
  }

  const center = {
    lat: 42.3314,
    lng: -83.0458,
  };

  return isLoaded ? (
    <GoogleMap
      id="map"
      options={computedOptions}
      onLoad={onLoad}
      mapContainerClassName={className}
      center={center}
      zoom={8}
    >
      {children}
    </GoogleMap>
  ) : (
    <CircularProgress />
  );
};

Map.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object),
  onLoad: PropTypes.func,
  options: PropTypes.object,
  className: PropTypes.string,
};

Map.defaultProps = {
  children: null,
  onLoad: undefined,
  options: {},
  className: undefined,
};

export default Map;
