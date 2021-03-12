import { Client } from '@googlemaps/google-maps-services-js';
import { config } from '../../../config';
import { formatPlace } from '../../util/places';

const GOOGLE_API_KEY = config.get('google.apiKey');

const client = new Client({});

const FIELD_MAP = {
  id: 'place_id',
  types: 'type',
  name: 'name',
  url: 'url',
  rating: 'rating',
  location: 'geometry',
  photos: 'photo',
};

const formatSelectionsToFields = (selections) =>
  selections.reduce(
    (fields, { name: { value } }) =>
      FIELD_MAP[value] ? [...fields, FIELD_MAP[value]] : fields,
    []
  );

export const place = async (
  parent,
  { id },
  context,
  {
    fieldNodes: [
      {
        selectionSet: { selections },
      },
    ],
  }
) => {
  try {
    const response = await client.placeDetails({
      params: {
        key: GOOGLE_API_KEY,
        place_id: id,
        // Other potentially useful fields not returned by place search API
        // formatted_address
        // price_level
        // review
        // website
        fields: formatSelectionsToFields(selections),
      },
    });

    const {
      data: { result },
    } = response;

    return formatPlace(result);
  } catch (error) {
    console.error(error);
  }

  return null;
};
