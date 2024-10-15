const LOAD_SPOTS = 'spots/LOAD_SPOTS';

const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots
});

export const fetchSpots = () => async (dispatch) => {
  const response = await fetch('/api/spots');
  
  if (response.ok) {
    const spots = await response.json();
    dispatch(loadSpots(spots));
  }
};

const initialState = { allSpots: {} };

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const allSpots = {};
      action.spots.forEach(spot => {
        allSpots[spot.id] = spot;
      });
      return {
        ...state,
        allSpots: allSpots
      };
    }
    default:
      return state;
  }
};

export default spotsReducer;

