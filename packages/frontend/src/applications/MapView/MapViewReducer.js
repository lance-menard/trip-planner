import { createReducer } from 'reduxsauce';
import types from '~/store/types';

const INITIAL_STATE = {
  userId: 1,
  selectedTrip: null,
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
