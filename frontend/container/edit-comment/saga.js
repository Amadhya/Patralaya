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
export const getDeleteStatus = state => state.commentEditReducer.pending;
export const getDeleteError = state => state.commentEditReducer.error;
export const getDeleteSuccess = state => state.commentEditReducer.success;

//SAGA
export default function fetchCommentEditDetails(comment_id,edit_text) {
  return dispatch => {
    dispatch(commentEditPending());
    return fetch(`http://127.0.0.1:8000/api/comment/edit/${comment_id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({comment_text: edit_text})
    })
      .then(res => res.json())
      .then(res => {
        if(res.status === 400)
          throw res.message;

        dispatch(commentEditSuccess());
      })
      .catch(error => {
        dispatch(commentEditFailure(error))
      })
  };
};
