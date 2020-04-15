import cookie from 'js-cookie';
import {DOMAIN_URL, BASE_URL} from "../../constants/api";

const ACTIONS = {
  DELETE: 'COMMENT_DELETE',
  DELETE_SUCCESS: 'COMMENT_DELETE_SUCCESS',
  DELETE_FAILURE: 'COMMENT_DELETE_FAILURE',
};

//ACTIONS
const commentDeletePending = () => {
  return {
    type: ACTIONS.DELETE,
  }
};

const commentDeleteSuccess = () => {
  return{
    type: ACTIONS.DELETE_SUCCESS,
  }
};

const commentDeleteFailure = (error) => {
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

export function commentDeleteReducer(state=initialState, action) {
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
        pending: false,
        success: false,
        error: action.error,
      };
    default:
      return state;
  }
}

//SELECTORS
export const getDeleteStatus = state => state.commentDeleteReducer.pending;
export const getDeleteError = state => state.commentDeleteReducer.error;
export const getDeleteSuccess = state => state.commentDeleteReducer.success;

//SAGA
export default function fetchCommentDeleteDetails(comment_id) {
  return dispatch => {
    dispatch(commentDeletePending());
    return fetch(`${DOMAIN_URL}${BASE_URL}comment/delete/${comment_id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cookie.get('token')}`,
      }
    })
        .then(res => res.json())
        .then(res => {
          if(res.status === 200)
            dispatch(commentDeleteSuccess());
          else  
            throw res.message;
        })
        .catch(error => {
          dispatch(commentDeleteFailure(error))
        })
  };
};
