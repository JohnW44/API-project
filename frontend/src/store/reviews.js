const LOAD_SPOT_REVIEWS = 'reviews/LOAD_SPOT_REVIEWS';

const loadSpotReviews = (reviews) => ({
  type: LOAD_SPOT_REVIEWS,
  reviews
});

export const fetchSpotReviews = (spotId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/spots/${spotId}/reviews`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Fetched reviews:', data);
      dispatch(loadSpotReviews(data.Reviews || []));
    } else {
      console.error('Failed to fetch reviews');
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};

const initialState = { spotReviews: [] };

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOT_REVIEWS:
      return { ...state, spotReviews: action.reviews };
    default:
      return state;
  }
};

export default reviewsReducer;
