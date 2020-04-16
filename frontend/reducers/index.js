import {combineReducers} from "redux";

import {loginReducer} from "../container/login/saga";
import {signupReducer} from "../container/signup/saga";
import {passwordChangeReducer} from "../container/change_password/saga";
import {editProfileReducer} from "../container/edit_profile/saga";
import {googleLoginReducer} from "../container/google_login/saga";
import {blogFeedReducer} from "../container/blog_feed/saga";
import {userReducer} from "../container/current-user/saga";
import {newBlogReducer} from "../container/new-blog/saga";
import {blogReducer} from "../container/blog/saga";
import {newCommentReducer} from "../container/new-comment/saga";
import {likeReducer} from "../container/like/saga";
import {unlikeReducer} from "../container/unlike/saga";
import {profileBlogFeedReducer} from "../container/personal-blog/saga";
import {blogDeleteReducer} from "../container/delete-blog/saga";
import {blogEditReducer} from "../container/edit-blog/saga";
import {commentDeleteReducer} from "../container/delete-comment/saga";
import {commentEditReducer} from "../container/edit-comment/saga";
import {tagBlogsReducer} from "../container/tag_blog/saga";

const rootReducer = combineReducers({
    loginReducer, 
    googleLoginReducer,
    passwordChangeReducer,
    editProfileReducer,
    blogReducer,
    blogFeedReducer, 
    signupReducer, 
    newBlogReducer, 
    profileBlogFeedReducer, 
    userReducer, 
    blogDeleteReducer, 
    blogEditReducer, 
    newCommentReducer, 
    commentEditReducer, 
    commentDeleteReducer, 
    likeReducer, 
    unlikeReducer,
    tagBlogsReducer
});

export default rootReducer;