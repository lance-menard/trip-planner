import { GoogleMap } from '@react-google-maps/api';
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
  const computedOptions = useMemo(
    () => mergeDeepRight(getStandardOptions(), options),
    [options]
  );

  const center = {
    lat: 42.3314,
    lng: -83.0458,
  };

  return (
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
