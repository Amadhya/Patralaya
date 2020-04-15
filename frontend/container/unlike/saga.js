import cookie from 'js-cookie';
import {DOMAIN_URL, BASE_URL} from "../../constants/api";

const ACTIONS = {
  DELETE: 'UNLIKE_DELETE',
  DELETE_SUCCESS: 'UNLIKE_DELETE_SUCCESS',
  DELETE_FAILURE: 'UNLIKE_DELETE_FAILURE',
};

//ACTIONS
const unlikePending = () => {
  return {
    type: ACTIONS.DELETE,
  }
};

const unlikeSuccess = () => {
  return{
    type: ACTIONS.DELETE_SUCCESS,
  }
};

const unlikeFailure = (error) => {
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

export function unlikeReducer(state=initialState, action) {
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
export const getStatus = state => state.unlikeReducer.pending;
export const getError = state => state.unlikeReducer.error;
export const getSuccess = state => state.unlikeReducer.success;

//SAGA
export default function fetchUnlikeDetails(blog_id) {
  return dispatch => {
    dispatch(unlikePending());
    return fetch(`${DOMAIN_URL}${BASE_URL}unlike`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cookie.get('token')}`,
      },
      body: JSON.stringify({blog_id: blog_id})
    })
        .then(res => res.json())
        .then(res => {
          if(res.status === 200)
            dispatch(unlikeSuccess());
          else
            throw res.message;
        })
        .catch(error => {
          dispatch(unlikeFailure(error))
        })
  };
};
