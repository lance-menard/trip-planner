import types from '~/store/types';

export const setSelectedTrip = ({ selectedTrip }) => ({
  type: types.mapView.UPDATE_FIELD,
  payload: {
    field: 'selectedTrip',
    value: selectedTrip,
  },
});

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
