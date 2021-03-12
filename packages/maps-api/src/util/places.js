const formatPlacePhoto = ({
  photo_reference,
  html_attributions,
  ...photo
}) => ({
  ...photo,
  reference: photo_reference,
  attributions: html_attributions,
});

export const formatPlace = ({
  place_id,
  geometry: { location } = {},
  name,
  rating,
  types,
  url,
  photos = [],
  ...data
}) => ({
  id: place_id,
  location,
  name,
  rating,
  types,
  url,
  photos: photos.map(formatPlacePhoto),
  data,
});
