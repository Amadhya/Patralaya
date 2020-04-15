import {DOMAIN_URL, BASE_URL} from "../../constants/api";

const ACTIONS = {
  GET: 'BLOG_FEED_GET',
  GET_SUCCESS: 'BLOG_FEED_GET_SUCCESS',
  GET_FAILURE: 'BLOG_FEED_GET_FAILURE',
};

//ACTIONS
const blogFeedPending = () => {
  return {
    type: ACTIONS.GET,
  }
};

const blogFeedSuccess = (blogFeed) => {
  return{
    type: ACTIONS.GET_SUCCESS,
    blogFeed,
  }
};

const blogFeedFailure = (error) => {
  return{
    type: ACTIONS.GET_FAILURE,
    error,
  }
};

//REDUCER
const initialState = {
  pending: false,
  error: null,
  blogFeed: [],
  success: false,
};

export function blogFeedReducer(state=initialState, action) {
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
        blogFeed: action.blogFeed,
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
export const getStatus = state => state.blogFeedReducer.pending;
export const getBlogFeed = state => state.blogFeedReducer.blogFeed;
export const getSuccess = state => state.blogFeedReducer.success;
export const getError = state => state.blogFeedReducer.error;

//SAGA
export default function fetchBlogFeed(queryFilter) {
  let filter = '';
  if(typeof queryFilter !== "undefined")
    filter=queryFilter;

  return dispatch => {
    dispatch(blogFeedPending());
     return fetch(`${DOMAIN_URL}${BASE_URL}blog/feed?filter=${filter}`)
    .then(res => res.json())
    .then(res => {
      if(res.status === 200)
        dispatch(blogFeedSuccess(res.feed));
      else
        throw res.message
    })
    .catch(error => {
      dispatch(blogFeedFailure(error))
    })
  };
};
