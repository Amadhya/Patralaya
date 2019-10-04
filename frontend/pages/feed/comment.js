import React, {PureComponent} from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Box, Typography, TextField, Avatar} from "@material-ui/core";
import {FlexView} from "../../components/layout";
import styled from 'styled-components';

import fetchNewCommentDetails, {getNewComment, getSuccess, getError, getStatus} from "../../container/new-comment/saga";
import {store} from "../_app";

const CommentWrapper = styled(Box)`
  padding: 10px;
  border: 1px solid #ededed;
  border-radius: 0px 20px 20px 20px;
  background-color: #ededed;
  width: 100%;
`;
const AvatarWrapper = styled(Avatar)`
  width: 30px !important;
  height: 30px !important;
  margin-top: 5px;
  background-color: #f44336 !important;
`;

class Comment extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      comment_text: '',
      isClicked: false,
      newCommentList: [],
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {newCommentList, isClicked} = this.state;
    const {newComment, pending, success} = this.props;

    if(isClicked && !pending && success && newComment){
      this.setState({
        isClicked: false,
        newCommentList: [
            ...newCommentList,
            newComment,
        ],
      })
    }
  }

  onChange = (e) => {
    this.setState({
      comment_text: e.target.value,
    })
  };

  addComment = (e) => {
    const {postId, actions} =this.props;
    const {comment_text} = this.state;
    const {userReducer: {user: currUser}} = store.getState();

    actions.fetchNewCommentDetails(currUser.id,postId,comment_text);

    this.setState({
      comment_text: '',
      isClicked: true,
    });
  };

  render() {
    const {comments} = this.props;
    const {comment_text, newCommentList} = this.state;

    const currComments = [
        ...comments,
        ...newCommentList,
    ];

    return(
      <div>
        <TextField
            id="outlined-textarea"
            label="Add a comment..."
            multiline
            margin="normal"
            variant="outlined"
            value={comment_text}
            fullWidth
            onChange={e => this.onChange(e)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                this.addComment(event)
              }
            }}
        />
        {currComments.map(item => (
            <Box display="flex" mb={2} mt={1} key={item.id}>
              <AvatarWrapper aria-label="name">
                {item.user.first_name[0]}
              </AvatarWrapper>
              <CommentWrapper ml={1}>
                <FlexView alignItems="center" justify="space-between">
                  <Typography variant="subtitle1" color="textPrimary">
                    {item.user.first_name}&nbsp;{item.user.last_name}
                  </Typography>
                  <Typography variant="caption" color="textPrimary">
                    {new Date(item.updated_on).toDateString()}
                  </Typography>
                </FlexView>
                <br/>
                <Typography variant="body2" color="textPrimary">
                  {item.comment_text}
                </Typography>
              </CommentWrapper>
            </Box>
        ))}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  newComment: getNewComment(state),
  error: getError(state),
  pending: getStatus(state),
  success: getSuccess(state),
});
export default connect(
    mapStateToProps,
    dispatch => ({
      actions: bindActionCreators({fetchNewCommentDetails}, dispatch)
    })
)(Comment)