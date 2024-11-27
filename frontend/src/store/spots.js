import { csrfFetch } from './csrf';

const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_SPOT_DETAILS = 'spots/LOAD_SPOT_DETAILS';
const ADD_SPOT = 'spots/ADD_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT'
const UPDATE_SPOT = 'spots/UPDATE_SPOT';
const SET_LOADING = 'spots/SET_LOADING';

// Action Creators
const loadSpots = (spotsData) => ({
  type: LOAD_SPOTS,
  spotsData
});

const loadSpotDetails = (spotDetails) => ({
  type: LOAD_SPOT_DETAILS,
  spotDetails
});

const addOneSpot = (spot) => ({
  type: ADD_SPOT,
  spot
});

export const deleteSpot = (spot) => ({
  type: DELETE_SPOT,
  spot
})

export const updateSpot = (spot) => ({
  type: UPDATE_SPOT,
  spot
})

const setLoading = (isLoading) => ({
  type: SET_LOADING,
  isLoading
});

//Thunk Actions
export const fetchSpots = () => async (dispatch, getState) => {
  const state = getState();
  if (state.spots.isLoading) return;

  dispatch(setLoading(true));
  const response = await csrfFetch('/api/spots');
  
  if (response.ok) {
    const spotsData = await response.json();
    dispatch(loadSpots(spotsData));
  }
  
  dispatch(setLoading(false));
};

export const fetchSpotDetails = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  
  if (response.ok) {
    const spotDetails = await response.json();
    
    if (spotDetails.SpotImages?.length > 0) {
      const previewImage = spotDetails.SpotImages.find(img => img.preview)?.url || '';
      const nonPreviewImages = spotDetails.SpotImages.filter(img => !img.preview);

      spotDetails.previewImage = previewImage;
      nonPreviewImages.forEach((img, index) => {
        if (index < 4) {
          spotDetails[`image${index + 1}`] = img.url;
        }
      });
    }

    spotDetails.image1 = spotDetails.image1 || '';
    spotDetails.image2 = spotDetails.image2 || '';
    spotDetails.image3 = spotDetails.image3 || '';
    spotDetails.image4 = spotDetails.image4 || '';

    dispatch(loadSpotDetails(spotDetails));
  }
};

export const fetchDeleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (response.ok) {
    dispatch(deleteSpot({ id: spotId }));
  }
};

export const createSpot = (spotData) => async dispatch => {
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spotData)
  });

  if (!response.ok) {
    const error = await response.json();
    return error;
  }

  const spot = await response.json();
  const imagePromises = [];
  
  if (spotData.previewImage) {
    imagePromises.push(
      csrfFetch(`/api/spots/${spot.id}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: spotData.previewImage,
          preview: true
        })
      })
    );
  }

  for (let i = 1; i <= 4; i++) {
    if (spotData[`image${i}`]) {
      imagePromises.push(
        csrfFetch(`/api/spots/${spot.id}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: spotData[`image${i}`],
            preview: false
          })
        })
      );
    }
  }

  await Promise.all(imagePromises);
  
  spot.previewImage = spotData.previewImage;
  for (let i = 1; i <= 4; i++) {
    spot[`image${i}`] = spotData[`image${i}`] || '';
  }
  
  dispatch(addOneSpot(spot));
  return spot;
};

export const updateExistingSpot = (spotId, spotData) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: spotData.address,
      city: spotData.city,
      state: spotData.state,
      country: spotData.country,
      lat: spotData.lat,
      lng: spotData.lng,
      name: spotData.name,
      description: spotData.description,
      price: spotData.price
    })
  });

  if (!response.ok) {
    const error = await response.json();
    return error;
  }

  const existingSpot = await csrfFetch(`/api/spots/${spotId}`);
  const spotDetails = await existingSpot.json();
  
  if (spotDetails.SpotImages) {
    for (let image of spotDetails.SpotImages) {
      await csrfFetch(`/api/spot-images/${image.id}`, {
        method: 'DELETE'
      });
    }
  }

  const newSpotImages = [];

  if (spotData.previewImage) {
    const previewResponse = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: spotData.previewImage,
        preview: true
      })
    });
    const previewImage = await previewResponse.json();
    newSpotImages.push(previewImage);
  }

  for (let i = 1; i <= 4; i++) {
    if (spotData[`image${i}`]) {
      const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: spotData[`image${i}`],
          preview: false
        })
      });
      const image = await response.json();
      newSpotImages.push(image);
    }
  }

  
  const finalResponse = await csrfFetch(`/api/spots/${spotId}`);
  const finalSpotDetails = await finalResponse.json();

  finalSpotDetails.previewImage = spotData.previewImage;
  finalSpotDetails.image1 = spotData.image1 || '';
  finalSpotDetails.image2 = spotData.image2 || '';
  finalSpotDetails.image3 = spotData.image3 || '';
  finalSpotDetails.image4 = spotData.image4 || '';
  finalSpotDetails.SpotImages = newSpotImages;

  dispatch(loadSpotDetails(finalSpotDetails));
  
  return finalSpotDetails;
};

export const getSpotDetails = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  
  if (!response.ok) return;
  
  const spotDetails = await response.json();
  
  if (spotDetails.SpotImages?.length > 0) {
    const previewImage = spotDetails.SpotImages.find(img => img.preview)?.url || '';
    const nonPreviewImages = spotDetails.SpotImages.filter(img => !img.preview);

    spotDetails.previewImage = previewImage;
    nonPreviewImages.forEach((img, index) => {
      if (index < 4) {
        spotDetails[`image${index + 1}`] = img.url;
      }
    });
  }

  spotDetails.image1 = spotDetails.image1 || '';
  spotDetails.image2 = spotDetails.image2 || '';
  spotDetails.image3 = spotDetails.image3 || '';
  spotDetails.image4 = spotDetails.image4 || '';

  dispatch(loadSpotDetails(spotDetails));
};

//Reducers
const initialState = { 
    spotsObj: {},
    currentSpot: null, 
    page: 1, 
    size: 20,
    isLoading: false
};

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {  
        case LOAD_SPOTS: {
            const spotsObj = {};
            action.spotsData.Spots.forEach(spot => {
                spotsObj[spot.id] = spot;
            });
            return { ...state, spotsObj };
        }
        case LOAD_SPOT_DETAILS: {
            const spotDetails = { ...action.spotDetails };
            const existingSpot = state.spotsObj[spotDetails.id];
            
            spotDetails.previewImage = spotDetails.previewImage || existingSpot?.previewImage || '';
            spotDetails.image1 = spotDetails.image1 || existingSpot?.image1 || '';
            spotDetails.image2 = spotDetails.image2 || existingSpot?.image2 || '';
            spotDetails.image3 = spotDetails.image3 || existingSpot?.image3 || '';
            spotDetails.image4 = spotDetails.image4 || existingSpot?.image4 || '';

            return {
                ...state,
                spotsObj: {
                    ...state.spotsObj,
                    [spotDetails.id]: spotDetails
                },
                currentSpot: spotDetails
            };
        }
        case ADD_SPOT:
            return { 
                ...state, 
                spotsObj: {
                    ...state.spotsObj,
                    [action.spot.id]: action.spot
                }
            };
        case DELETE_SPOT: {
            const newSpotsObj = { ...state.spotsObj };
            delete newSpotsObj[action.spot.id];
            return {
                ...state,
                spotsObj: newSpotsObj
            };
        } 
        case UPDATE_SPOT:
            return {
                ...state,
                spotsObj: {
                    ...state.spotsObj,
                    [action.spot.id]: {
                        ...state.spotsObj[action.spot.id],
                        ...action.spot,
                        previewImage: action.spot.previewImage || state.spotsObj[action.spot.id]?.previewImage
                    }
                }
            };
        case SET_LOADING:
            return { ...state, isLoading: action.isLoading };
        default:
            return state;
    }
};

export default spotsReducer;
