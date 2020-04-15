import cookie from 'js-cookie';
import {DOMAIN_URL, BASE_URL} from "../../constants/api";

const ACTIONS = {
  PATCH: 'BLOG_EDIT',
  PATCH_SUCCESS: 'BLOG_EDIT_SUCCESS',
  PATCH_FAILURE: 'BLOG_EDIT_FAILURE',
};

//ACTIONS
const blogEditPending = () => {
  return {
    type: ACTIONS.PATCH,
  }
};

const blogEditSuccess = () => {
  return{
    type: ACTIONS.PATCH_SUCCESS,
  }
};

const blogEditFailure = (error) => {
  return{
    type: ACTIONS.PATCH_FAILURE,
    error,
  }
};

//REDUCER
const initialState = {
  pending: false,
  error: null,
  success: false,
};

export function blogEditReducer(state=initialState, action) {
  switch (action.type) {
    case ACTIONS.PATCH:
      return {
        ...state,
        pending: true,
      };
    case ACTIONS.PATCH_SUCCESS:
      return {
        ...state,
        error: null,
        pending: false,
        success: true,
      };
    case ACTIONS.PATCH_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

//SELECTORS
export const getStatus = state => state.blogEditReducer.pending;
export const getError = state => state.blogEditReducer.error;
export const getSuccess = state => state.blogEditReducer.success;

//SAGA
export default function fetchBlogEditDetails(blog_id,edit_text,edit_title) {
  return dispatch => {
    dispatch(blogEditPending());
    return fetch(`${DOMAIN_URL}${BASE_URL}blog/edit/${blog_id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${cookie.get('token')}`,
      },
      body: JSON.stringify({blog_text: edit_text, title: edit_title})
    })
        .then(res => res.json())
        .then(res => {
          if(res.status === 200)
            dispatch(blogEditSuccess());
          else
            throw res.message;
        })
        .catch(error => {
          dispatch(blogEditFailure(error))
        })
  };
};
