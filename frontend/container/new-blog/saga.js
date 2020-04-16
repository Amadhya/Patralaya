import cookie from 'js-cookie';
import {DOMAIN_URL, BASE_URL} from "../../constants/api";

const ACTIONS = {
  POST: 'NEW_BLOG',
  POST_SUCCESS: 'NEW_BLOG_SUCCESS',
  POST_FAILURE: 'NEW_BLOG_FAILURE',
};

//ACTIONS
const newBlogPending = () => {
  return {
    type: ACTIONS.POST,
  }
};

const newBlogSuccess = (new_blog) => {
  return{
    type: ACTIONS.POST_SUCCESS,
    new_blog,
  }
};

const newBlogFailure = (error) => {
  return{
    type: ACTIONS.POST_FAILURE,
    error,
  }
};

//REDUCER
const initialState = {
  pending: false,
  error: null,
  new_blog: null,
  success: false,
};

export function newBlogReducer(state=initialState, action) {
  switch (action.type) {
    case ACTIONS.POST:
      return {
        ...state,
        pending: true,
      };
    case ACTIONS.POST_SUCCESS:
      return {
        ...state,
        error: null,
        pending: false,
        success: true,
        new_blog: action.new_blog,
      };
    case ACTIONS.POST_FAILURE:
      return {
        ...state,
        pending: false,
        error: action.error,
      };
    default:
      return state;
  }
}

//SELECTORS
export const getNewBlog = state => state.newBlogReducer.new_blog;
export const getNewBlogStatus = state => state.newBlogReducer.pending;
export const getNewBlogError = state => state.newBlogReducer.error;
export const getNewBlogSuccess = state => state.newBlogReducer.success;

//SAGA
export default function fetchNewBlogDetails(title, blog_text, category, tags) {
  return dispatch => {
    dispatch(newBlogPending());
    return fetch(`${DOMAIN_URL}${BASE_URL}blog`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookie.get('token')}`,
      },
      body: JSON.stringify({title: title, blog_text: blog_text, category: category, tags: tags})
    })
        .then(res => res.json())
        .then(res => {
          if(res.status == 200)
            dispatch(newBlogSuccess(res.blog));
          else
            throw res.message;
        })
        .catch(error => {
          dispatch(newBlogFailure(error))
        })
  };
};
