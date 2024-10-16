const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_SPOT_DETAILS = 'spots/LOAD_SPOT_DETAILS';

// Action Creators
const loadSpots = (spotsData) => ({
  type: LOAD_SPOTS,
  spotsData
});

const loadSpotDetails = (spotDetails) => ({
  type: LOAD_SPOT_DETAILS,
  spotDetails
});

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



const initialState = { Spots: [], currentSpot: null, page: 1, size: 20 };

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {  
    case LOAD_SPOTS:
      return action.spotsData;
    case LOAD_SPOT_DETAILS:
      return { ...state, currentSpot: action.spotDetails };
    default:
      return state;
  }
};

export default spotsReducer;
