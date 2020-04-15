import cookie from 'js-cookie';
import {DOMAIN_URL, BASE_URL} from "../../constants/api";

const ACTIONS = {
  DELETE: 'BLOG_DELETE',
  DELETE_SUCCESS: 'BLOG_DELETE_SUCCESS',
  DELETE_FAILURE: 'BLOG_DELETE_FAILURE',
};

//ACTIONS
const blogDeletePending = () => {
  return {
    type: ACTIONS.DELETE,
  }
};

const blogDeleteSuccess = () => {
  return{
    type: ACTIONS.DELETE_SUCCESS,
  }
};

const blogDeleteFailure = (error) => {
  return{
    type: ACTIONS.DELETE_FAILURE,
    error,
  }
};

//REDUCER
const initialState = {
  pending: false,
  error: null,
  success: false,
};

export function blogDeleteReducer(state=initialState, action) {
  switch (action.type) {
    case ACTIONS.DELETE:
      return {
        ...state,
        pending: true,
      };
    case ACTIONS.DELETE_SUCCESS:
      return {
        ...state,
        error: null,
        pending: false,
        success: true,
      };
    case ACTIONS.DELETE_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

//SELECTORS
export const getDeleteStatus = state => state.blogDeleteReducer.pending;
export const getDeleteError = state => state.blogDeleteReducer.error;
export const getDeleteSuccess = state => state.blogDeleteReducer.success;

//SAGA
export default function fetchBlogDeleteDetails(blog_id) {
  return dispatch => {
    dispatch(blogDeletePending());
    return fetch(`${DOMAIN_URL}${BASE_URL}blog/delete/${blog_id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cookie.get('token')}`,
      }
    })
        .then(res => res.json())
        .then(res => {
          if(res.status === 200)
            dispatch(blogDeleteSuccess());
          else
            throw res.message;
        })
        .catch(error => {
          dispatch(blogDeleteFailure(error))
        })
  };
};
