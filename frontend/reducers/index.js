import {combineReducers} from "redux";

import {loginReducer} from "../container/login/saga";
import {signupReducer} from "../container/signup/saga";
import {feedReducer} from "../container/feed/saga";
import {userReducer} from "../container/current-user/saga";
import {newPostReducer} from "../container/new-post/saga";
import {newCommentReducer} from "../container/new-comment/saga";
import {likeReducer} from "../container/like/saga";
import {unlikeReducer} from "../container/unlike/saga";
import {profileFeedReducer} from "../container/personal-feed/saga";
import {postDeleteReducer} from "../container/delete-post/saga";
import {postEditReducer} from "../container/edit-post/saga";
import {commentDeleteReducer} from "../container/delete-comment/saga";
import {commentEditReducer} from "../container/edit-comment/saga";

const rootReducer = combineReducers({loginReducer, postDeleteReducer, signupReducer, postEditReducer, feedReducer, userReducer, profileFeedReducer, newPostReducer, newCommentReducer, commentEditReducer, commentDeleteReducer, likeReducer, unlikeReducer});

export default rootReducer;