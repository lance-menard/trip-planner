import { createReducer } from 'reduxsauce';
import types from '~/store/types';

const INITIAL_STATE = {
  trip: {
    id: 1,
    title: 'Trip 1',
    stops: [
      {
        id: 1,
        name: 'Detroit Zoo',
        order: 1,
        place: {
          location: {
            lat: 42.4768358,
            lng: -83.14904419999999,
          },
        },
      },
      {
        id: 2,
        name: 'Affleck House',
        order: 2,
        place: {
          location: {
            lat: 42.5881644,
            lng: -83.2500211,
          },
        },
      },
    ],
  },
};

const updateField = (state = INITIAL_STATE, { payload }) => {
  const { field, value } = payload;
  return {
    ...state,
    [field]: value,
  };
};

export const HANDLERS = {
  [types.mapView.UPDATE_FIELD]: updateField,
};

export default createReducer(INITIAL_STATE, HANDLERS);
