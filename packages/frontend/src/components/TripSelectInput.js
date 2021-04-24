import { CircularProgress, IconButton } from '@material-ui/core';
import { Refresh } from '@material-ui/icons';
import { gql, useQuery } from '@apollo/client';
import { prop } from 'ramda';
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

const GET_TRIPS = gql`
  query GetTrip($userId: Int) {
    trips: trip(where: { user_id: { _eq: $userId } }) {
      id
      title
    }
  }
`;

const filter = createFilterOptions();

const TripSelectInput = ({ userId, onChange, value, className }) => {
  const { loading, error, data: { trips } = {}, refetch } = useQuery(
    GET_TRIPS,
    {
      variables: { userId },
    }
  );

  return (
    <Autocomplete
      className={className}
      options={trips}
      getOptionLabel={prop('title')}
      value={value}
      onChange={onChange}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        // Suggest the creation of a new value
        if (params.inputValue !== '') {
          filtered.push({
            newTrip: true,
            inputValue: params.inputValue,
            title: `Add trip "${params.inputValue}"`,
          });
        }

        return filtered;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Trip"
          variant="outlined"
          error={!!error}
          helperText={error?.message}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  <IconButton onClick={() => refetch()} size="small">
                    <Refresh color="inherit" size={20} />
                  </IconButton>
                )}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

TripSelectInput.propTypes = {
  userId: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object,
  className: PropTypes.string,
};

TripSelectInput.defaultProps = {
  userId: null,
  value: null,
  className: '',
};

export default TripSelectInput;
