import types from '~/store/types';

export const loadTrip = ({ tripId }) => (dispatch) => {
  // Load from API
  dispatch({
    type: types.mapView.UPDATE_FIELD,
    payload: {
      field: 'trip',
      value: { title: 'Trip A' },
    },
  });
};
