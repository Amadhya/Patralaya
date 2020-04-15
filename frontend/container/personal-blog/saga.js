import cookie from 'js-cookie';
import {DOMAIN_URL, BASE_URL} from "../../constants/api";

const ACTIONS = {
  GET: 'PROFILE_BLOG_FEED_GET',
  GET_SUCCESS: 'PROFILE_BLOG_FEED_GET_SUCCESS',
  GET_FAILURE: 'PROFILE_BLOG_FEED_GET_FAILURE',
};

//ACTIONS
const profileBlogFeedPending = () => {
  return {
    type: ACTIONS.GET,
  }
};

const profileBlogFeedSuccess = (blogFeed,user) => {
  return{
    type: ACTIONS.GET_SUCCESS,
    blogFeed,
    user,
  }
};

const profileBlogFeedFailure = (error) => {
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
  user: null,
  success: false,
};

export function profileBlogFeedReducer(state=initialState, action) {
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
        user: action.user,
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
export const getStatus = state => state.profileBlogFeedReducer.pending;
export const getProfileBlogFeed = state => state.profileBlogFeedReducer.blogFeed;
export const getUserProfile = state => state.profileBlogFeedReducer.user;
export const getSuccess = state => state.profileBlogFeedReducer.success;
export const getError = state => state.profileBlogFeedReducer.error;

//SAGA
export default function fetchProfileBlogFeed(id) {
  return dispatch => {
    dispatch(profileBlogFeedPending());
    return fetch(`${DOMAIN_URL}${BASE_URL}user/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${cookie.get('token')}`,
      }
    })
        .then(res => res.json())
        .then(res => {
          if(res.status === 200)
            dispatch(profileBlogFeedSuccess(res.feed,res.user));
          else
            throw res.message
        })
        .catch(error => {
          dispatch(profileBlogFeedFailure(error))
        })
  };
};
