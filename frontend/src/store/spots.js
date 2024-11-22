const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_SPOT_DETAILS = 'spots/LOAD_SPOT_DETAILS';
const ADD_SPOT = 'spots/ADD_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT'

// Action Creators
const loadSpots = (spotsData) => ({
  type: LOAD_SPOTS,
  spotsData
});

const loadSpotDetails = (spotDetails) => ({
  type: LOAD_SPOT_DETAILS,
  spotDetails
});

export const addSpot = (spot) => ({
  type: ADD_SPOT,
  spot
})

export const deleteSpot = (spot) => ({
  type: DELETE_SPOT,
  spot
})

//Thunk Actions
export const fetchSpots = () => async (dispatch) => {
  const response = await fetch('/api/spots');
  
  if (response.ok) {
    const spotsData = await response.json();
    dispatch(loadSpots(spotsData));
  }
};

export const fetchSpotDetails = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`);
  
  if (response.ok) {
    const spotDetails = await response.json();
    dispatch(loadSpotDetails(spotDetails));
  }
};

export const fetchDeleteSpot = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`, {
    method: 'DELETE'
  })
  if (response.ok) {
    dispatch(deleteSpot({ id: spotId }))
  }
}   


//Reducers
const initialState = { 
    spotsObj: {}, // spots stored by their ID
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
        default:
            return state;
    }
};

export default spotsReducer;
