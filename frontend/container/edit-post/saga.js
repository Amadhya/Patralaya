const ACTIONS = {
  PATCH: 'POST_EDIT',
  PATCH_SUCCESS: 'POST_EDIT_SUCCESS',
  PATCH_FAILURE: 'POST_EDIT_FAILURE',
};

//ACTIONS
const postEditPending = () => {
  return {
    type: ACTIONS.PATCH,
  }
};

const postEditSuccess = () => {
  return{
    type: ACTIONS.PATCH_SUCCESS,
  }
};

const postEditFailure = (error) => {
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

export function postEditReducer(state=initialState, action) {
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
export const getDeleteStatus = state => state.postEditReducer.pending;
export const getDeleteError = state => state.postEditReducer.error;
export const getDeleteSuccess = state => state.postEditReducer.success;

//SAGA
export default function fetchPostEditDetails(post_id,edit_text) {
  return dispatch => {
    dispatch(postEditPending());
    return fetch(`http://127.0.0.1:8000/api/post/edit/${post_id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({post_text: edit_text})
    })
        .then(res => res.json())
        .then(res => {
          if(res.status === 400)
            throw res.message;

          dispatch(postEditSuccess());
        })
        .catch(error => {
          dispatch(postEditFailure(error))
        })
  };
};
