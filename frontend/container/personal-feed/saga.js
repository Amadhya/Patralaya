const ACTIONS = {
  GET: 'PROFILE_FEED_GET',
  GET_SUCCESS: 'PROFILE_FEED_GET_SUCCESS',
  GET_FAILURE: 'PROFILE_FEED_GET_FAILURE',
};

//ACTIONS
const profileFeedPending = () => {
  return {
    type: ACTIONS.GET,
  }
};

const profileFeedSuccess = (feed) => {
  return{
    type: ACTIONS.GET_SUCCESS,
    feed,
  }
};

const profileFeedFailure = (error) => {
  return{
    type: ACTIONS.GET_FAILURE,
    error,
  }
};

//REDUCER
const initialState = {
  pending: false,
  error: null,
  feed: [],
  success: false,
};

export function profileFeedReducer(state=initialState, action) {
  switch (action.type) {
    case ACTIONS.GET:
      return {
        ...state,
        pending: true,
      };
    case ACTIONS.GET_SUCCESS:
      return {
        ...state,
        pending: false,
        feed: action.feed,
        success: true,
      };
    case ACTIONS.GET_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

//SELECTORS
export const getStatus = state => state.profileFeedReducer.pending;
export const getProfileFeed = state => state.profileFeedReducer.feed;
export const getSuccess = state => state.profileFeedReducer.success;
export const getError = state => state.profileFeedReducer.error;

//SAGA
export default function fetchProfileFeed(user_id) {
  return dispatch => {
    dispatch(profileFeedPending());
    return fetch(`http://127.0.0.1:8000/api/post/${user_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
        .then(res => res.json())
        .then(res => {
          if(res.status === 200)
            dispatch(profileFeedSuccess(res.feed));
          else
            throw res.message
        })
        .catch(error => {
          dispatch(profileFeedFailure(error))
        })
  };
};
