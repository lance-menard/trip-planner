import { Client } from '@googlemaps/google-maps-services-js';
import { config } from '../../../config';
import { formatPlace } from '../../util/places';

const GOOGLE_API_KEY = config.get('google.apiKey');

const client = new Client({});

export const places = async (
  parent,
  { location, radius = 50000, keyword, rankBy, type },
  context,
  info
) => {
  try {
    const response = await client.placesNearby({
      params: {
        key: GOOGLE_API_KEY,
        location,
        radius,
        keyword,
        rankby: rankBy,
        type: type.toLowerCase(),
      },
    });

    const {
      data: { results },
    } = response;

    return results.map(formatPlace);
  } catch (error) {
    console.error(error);
  }

  return null;
};
