import { csrfFetch } from './csrf';

const LOAD_SPOT_REVIEWS = 'reviews/LOAD_SPOT_REVIEWS';
const ADD_REVIEW = 'reviews/ADD_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

const loadSpotReviews = (reviews) => ({
  type: LOAD_SPOT_REVIEWS,
  reviews
});

const addReview = (review) => ({
  type: ADD_REVIEW,
  review
});

const deleteReviewAction = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId
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

export const createReview = (reviewData, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData)
  });

  if (response.ok) {
    const newReview = await response.json();
    dispatch(addReview(newReview));
    dispatch(fetchSpotReviews(spotId));   
    return newReview;
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    dispatch(deleteReviewAction(reviewId));
    return true;
  }
};

const initialState = {
  state: {
    reviewsObj: {},
    currentSpotReviews: []
  }
};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOT_REVIEWS: {
      const reviewsObj = {};
      action.reviews.forEach(review => {
        reviewsObj[review.id] = review;
      });
      return {
        ...state,
        state: {
          reviewsObj,
          currentSpotReviews: action.reviews.map(review => review.id)
        }
      };
    }
    case ADD_REVIEW: {
      const newReviewsObj = {
        ...state.state.reviewsObj,
        [action.review.id]: action.review
      };
      return {
        ...state,
        state: {
          reviewsObj: newReviewsObj,
          currentSpotReviews: [...state.state.currentSpotReviews, action.review.id]
        }
      };
    }
    case DELETE_REVIEW: {
      const newReviewsObj = { ...state.state.reviewsObj };
      delete newReviewsObj[action.reviewId];
      return {
        ...state,
        state: {
          reviewsObj: newReviewsObj,
          currentSpotReviews: state.state.currentSpotReviews.filter(id => id !== action.reviewId)
        }
      };
    }
    default:
      return state;
  }
};

export default reviewsReducer;
