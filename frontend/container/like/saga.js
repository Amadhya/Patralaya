import cookie from 'js-cookie';
import {DOMAIN_URL, BASE_URL} from "../../constants/api";

const ACTIONS = {
  POST: 'LIKE_POST',
  POST_SUCCESS: 'LIKE_POST_SUCCESS',
  POST_FAILURE: 'LIKE_POST_FAILURE',
};

//ACTIONS
const likePending = () => {
  return {
    type: ACTIONS.POST,
  }
};

const likeSuccess = () => {
  return{
    type: ACTIONS.POST_SUCCESS,
  }
};

const likeFailure = (error) => {
  return{
    type: ACTIONS.POST_FAILURE,
    error,
  }
};

//REDUCER
const initialState = {
  pending: false,
  error: null,
  success: false,
};

export function likeReducer(state=initialState, action) {
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
      };
    case ACTIONS.POST_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

//SELECTORS
export const getStatus = state => state.likeReducer.pending;
export const getError = state => state.likeReducer.error;
export const getSuccess = state => state.likeReducer.success;

//SAGA
export default function fetchLikeDetails(blog_id) {
  return dispatch => {
    dispatch(likePending());
    return fetch(`${DOMAIN_URL}${BASE_URL}like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookie.get('token')}`,
      },
      body: JSON.stringify({blog_id: blog_id})
    })
        .then(res => res.json())
        .then(res => {
          if(res.status === 200)
            dispatch(likeSuccess());
          else
            throw res.message;
        })
        .catch(error => {
          dispatch(likeFailure(error))
        })
  };
};
