import React, {PureComponent} from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Box, Typography, TextField, Avatar, Button} from "@material-ui/core";
import {FlexView} from "../../components/layout";
import styled from 'styled-components';

import fetchNewCommentDetails, {getNewComment, getSuccess, getError, getStatus} from "../../container/new-comment/saga";
import fetchCommentDeleteDetails from "../../container/delete-comment/saga";
import fetchCommentEditDetails from "../../container/edit-comment/saga";
import {store} from "../_app";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from '@material-ui/icons/MoreVert';

const CommentWrapper = styled(Box)`
  padding: 0px 10px 10px 10px;
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
const ButtonWrapper = styled(Button)`
  float: right;
`;

class Comment extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      comment_text: '',
      isClicked: false,
      newCommentList: [],
      anchorEl: null,
      editCommentText: '',
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

  handleMenu = event => {
    this.setState({
      anchorEl: event.target,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  handleDeletePost = (obj) => {
    const {actions} = this.props;

    this.handleClose();
    obj.comment_text='';
    actions.fetchCommentDeleteDetails(obj.id);
  };

  handleEditPost = (obj) => {
    this.handleClose();
    this.setState({
      editCommentText: obj.comment_text,
    });
  };

  renderPopUp = (obj) => {
    const {anchorEl} = this.state;
    const open = Boolean(anchorEl);

    return (
        <div>
          <IconButton
              aria-label="edit comment"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={(e) => this.handleMenu(e)}
              color="inherit"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={() => this.handleClose()}
          >
            <MenuItem onClick={() => this.handleEditPost(obj)}>Edit</MenuItem>
            <MenuItem onClick={() => this.handleDeletePost(obj)}>Delete</MenuItem>
          </Menu>
        </div>
    );
  };

  onEditCommentChange = (event) => {
    this.setState({
      editCommentText: event.target.value,
    })
  };

  editComment = (obj) => {
    const {editCommentText} = this.state;
    const {actions} = this.props;

    obj.comment_text = editCommentText;
    actions.fetchCommentEditDetails(obj.id, obj.comment_text);
    this.setState({
      editCommentText: '',
    })
  };

  renderEditComment = (obj) => {
    const {editCommentText} = this.state;

    return(
        <div>
          <TextField
              id="outlined-textarea"
              label="Edit Comment...."
              multiline
              margin="normal"
              variant="outlined"
              fullWidth
              autoFocus={true}
              value={editCommentText}
              onChange={e => this.onEditCommentChange(e)}
          />
          <ButtonWrapper variant="outlined" color="secondary" onClick={() => this.editComment(obj)}>
            Save
          </ButtonWrapper>
        </div>
    );
  };

  render() {
    const {comments} = this.props;
    const {comment_text, newCommentList, editCommentText} = this.state;

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
            item.comment_text !== '' && <Box display="flex" mb={2} mt={1} key={item.id}>
              <AvatarWrapper aria-label="name">
                {item.user.first_name[0]}
              </AvatarWrapper>
              <CommentWrapper ml={1}>
                <FlexView alignItems="center" justify="space-between">
                  <Typography variant="subtitle1" color="textPrimary">
                    {item.user.first_name}&nbsp;{item.user.last_name}
                  </Typography>
                  <FlexView alignItems="center">
                    <Typography variant="caption" color="textPrimary">
                      {new Date(item.updated_on).toDateString()}
                    </Typography>
                    {localStorage.getItem('user_id') === item.user.id && this.renderPopUp(item)}
                  </FlexView>
                </FlexView>
                <br/>
                {editCommentText !== '' ?
                  this.renderEditComment(item)
                  :
                  <Typography variant="body2" color="textPrimary">
                    {item.comment_text}
                  </Typography>
                }
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
      actions: bindActionCreators({fetchNewCommentDetails, fetchCommentDeleteDetails, fetchCommentEditDetails}, dispatch)
    })
)(Comment)