import cookie from 'js-cookie';
import {DOMAIN_URL, BASE_URL} from "../../constants/api";

const ACTIONS = {
  PATCH: 'COMMENT_EDIT',
  PATCH_SUCCESS: 'COMMENT_EDIT_SUCCESS',
  PATCH_FAILURE: 'COMMENT_EDIT_FAILURE',
};

//ACTIONS
const commentEditPending = () => {
  return {
    type: ACTIONS.PATCH,
  }
};

const commentEditSuccess = () => {
  return{
    type: ACTIONS.PATCH_SUCCESS,
  }
};

const commentEditFailure = (error) => {
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

export function commentEditReducer(state=initialState, action) {
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
export const getStatus = state => state.commentEditReducer.pending;
export const getError = state => state.commentEditReducer.error;
export const getSuccess = state => state.commentEditReducer.success;

//SAGA
export default function fetchCommentEditDetails(comment_id,edit_text) {
  return dispatch => {
    dispatch(commentEditPending());
    return fetch(`${DOMAIN_URL}${BASE_URL}comment/edit/${comment_id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${cookie.get('token')}`,
      },
      body: JSON.stringify({comment_text: edit_text})
    })
      .then(res => res.json())
      .then(res => {
        if(res.status === 200)
          dispatch(commentEditSuccess());
        else
          throw res.message;
      })
      .catch(error => {
        dispatch(commentEditFailure(error))
      })
  };
};
