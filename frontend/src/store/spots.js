import { csrfFetch } from './csrf';

const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_SPOT_DETAILS = 'spots/LOAD_SPOT_DETAILS';
const ADD_SPOT = 'spots/ADD_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT'
const UPDATE_SPOT = 'spots/UPDATE_SPOT';

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

//Thunk Actions
export const fetchSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');
  
  if (response.ok) {
    const spotsData = await response.json();
    dispatch(loadSpots(spotsData));
  }
};

export const fetchSpotDetails = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  
  if (response.ok) {
    const spotDetails = await response.json();
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
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(spotData)
  });

  if (!response.ok) {
    const error = await response.json();
    return error;
  }

  const spot = await response.json();
  
  if (spotData.previewImage) {
    const imageResponse = await csrfFetch(`/api/spots/${spot.id}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: spotData.previewImage,
        preview: true
      })
    });
    
    if (imageResponse.ok) {
      spot.previewImage = spotData.previewImage;
    }
  }
  
  dispatch(addOneSpot(spot));
  return spot;
};

export const updateExistingSpot = (spotId, spotData) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(spotData)
  });

  if (!response.ok) {
    const error = await response.json();
    return error;
  }

  const updatedSpot = await response.json();

  
  if (spotData.previewImage) {
    const imageResponse = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: spotData.previewImage,
        preview: true
      })
    });

    if (imageResponse.ok) {
      updatedSpot.previewImage = spotData.previewImage;
    }
  }

  dispatch(updateSpot(updatedSpot));
  return updatedSpot;
};

//Reducers
const initialState = { 
    spotsObj: {},
    currentSpot: null, 
    page: 1, 
    size: 20 
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
        case LOAD_SPOT_DETAILS:
            return {
                ...state,
                spotsObj: {
                    ...state.spotsObj,
                    [action.spotDetails.id]: action.spotDetails
                },
                currentSpot: action.spotDetails
            };
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
        default:
            return state;
    }
};

export default spotsReducer;
