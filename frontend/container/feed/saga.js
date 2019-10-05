// import fetch from 'isomorphic-fetch';

const ACTIONS = {
  GET: 'FEED_GET',
  GET_SUCCESS: 'FEED_GET_SUCCESS',
  GET_FAILURE: 'FEED_GET_FAILURE',
};

//ACTIONS
const feedPending = () => {
  return {
    type: ACTIONS.GET,
  }
};

const feedSuccess = (feed) => {
  return{
    type: ACTIONS.GET_SUCCESS,
    feed,
  }
};

const feedFailure = (error) => {
  return{
    type: ACTIONS.GET_FAILURE,
    error,
  }
};

//REDUCER
const initialState = {
  pending: false,
  error: null,
  feed: [],
  success: false,
};

export function feedReducer(state=initialState, action) {
  switch (action.type) {
    case ACTIONS.GET:
      return {
        ...state,
        pending: true,
      };
    case ACTIONS.GET_SUCCESS:
      return {
        ...state,
        pending: false,
        feed: action.feed,
        success: true,
      };
    case ACTIONS.GET_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

//SELECTORS
export const getStatus = state => state.feedReducer.pending;
export const getFeed = state => state.feedReducer.feed;
export const getSuccess = state => state.feedReducer.success;
export const getError = state => state.feedReducer.error;

//SAGA
export default function fetchFeed(queryFilter) {
  console.log(queryFilter);
  let filter = '';
  if(typeof queryFilter !== "undefined")
    filter=queryFilter;

  return dispatch => {
    dispatch(feedPending());
     return fetch(`http://127.0.0.1:8000/api/feed?filter=${filter}`)
    .then(res => res.json())
    .then(res => {
      if(res.status === 200)
        dispatch(feedSuccess(res.feed));
      else
        throw res.message
    })
    .catch(error => {
      dispatch(feedFailure(error))
    })
  };
};
