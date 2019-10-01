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
export default function fetchLikeDetails(post_id, user_id) {
  return dispatch => {
    dispatch(likePending());
    return fetch(`http://127.0.0.1:8000/api/like`, {
      method: 'POST',
      body: JSON.stringify({post_id: post_id, user_id: user_id})
    })
        .then(res => res.json())
        .then(res => {
          if(res.status === 400)
            throw res.message;

          dispatch(likeSuccess());
        })
        .catch(error => {
          dispatch(likeFailure(error))
        })
  };
};
