import React, {PureComponent, Fragment} from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Box, Typography, TextField, Avatar, Snackbar} from "@material-ui/core";
import styled from 'styled-components';
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MuiAlert from '@material-ui/lab/Alert';
import cookie from 'js-cookie';

import fetchCommentDeleteDetails, {getDeleteStatus, getDeleteError, getDeleteSuccess} from "../../../container/delete-comment/saga";
import fetchCommentEditDetails, {getStatus, getError, getSuccess} from "../../../container/edit-comment/saga";
import {FlexView, Separator} from "../../../components/layout";
import {ButtonLayout} from "../../../components/button";

const CommentWrapper = styled(Box)`
  padding: 0.4rem 1rem;
  border: 1px solid #ededed;
  border-radius: 0 1rem 1rem 1rem;
  background-color: #ededed;
  width: 100%;
`;
const AvatarWrapper = styled(Avatar)`
  background-color: #f44336 !important;
  width: 2.4rem !important;
  height: 2.4rem !important;
  margin-top: 0.4rem;
  margin-right: 0.1rem;
`;
const ButtonWrapper = styled(ButtonLayout)`
  float: right;
`;

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function dateTime (t){
  let newDate=new Date(t);

  let date = newDate.getDate();
  let month = newDate.getMonth();
  let year = newDate.getFullYear();
  let hour = newDate.getHours();
  let min = newDate.getMinutes(); 

  return `${monthNames[month]} ${date}, ${year} at ${hour}:${min} (IST)`
}

class CommentCard extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      edit: false,
      deleteComment: false,
      anchorEl: null,
      openSnackBar: false,
      editCommentText: '',
    }
  }

  componentDidUpdate(){
    const {commentObj, success, pending, error, deletePending, deleteSuccess, deleteError} = this.props;
    const {edit, deleteComment} = this.state;

    if(edit && ((typeof success !== "undefined" && typeof pending !== "undefined"&& !success && pending) || error)){
      if(error){
        this.setState({
          edit: false,
          openSnackBar: true,
        });
      }else{
        this.setState({
          editCommentText: '',
          edit: false,
          openSnackBar: true,
        });
      }
    }

    if(deleteComment && ((typeof deletePending !== "undefined" && typeof deleteSuccess !== "undefined"&& !deletePending && deleteSuccess) || deleteError)){
      if(deleteError){
        this.setState({
          openSnackBar: true,
          deleteComment: false,
        });
      }else{
        this.setState({
          openSnackBar: true,
          deleteComment: false,
        });
        commentObj.comment_text="";
      }
    }
  }

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

  handleDeleteComment = (obj) => {
    const {actions} = this.props;

    this.handleClose();
    this.setState({
      deleteComment: true,
    });
    actions.fetchCommentDeleteDetails(obj.id);
  };

  handleEditComment = (obj) => {
    this.handleClose();
    this.setState({
      editCommentText: obj.comment_text,
      edit: true,
    });
  };

  onEditCommentChange = (event) => {
    this.setState({
      editCommentText: event.target.value,
    })
  };

  onChange = (e) => {
    this.setState({
      comment_text: e.target.value,
    })
  };

  saveEditComment = (obj) => {
    const {editCommentText} = this.state;
    const {actions} = this.props;

    obj.comment_text = editCommentText;
    actions.fetchCommentEditDetails(obj.id, obj.comment_text);
  };

  handleSnackBarClose = () => {
    this.setState({
        openSnackBar: false,
    })
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
            <MenuItem onClick={() => this.handleEditComment(obj)}>Edit</MenuItem>
            <MenuItem onClick={() => this.handleDeleteComment(obj)}>Delete</MenuItem>
          </Menu>
        </div>
    );
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
          <ButtonWrapper variant="outlined" color="primary" onClick={() => this.saveEditComment(obj)}>
            Save
          </ButtonWrapper>
        </div>
    );
  };

  render() {
    const {commentObj, error, deleteError} = this.props;
    const {edit, openSnackBar} = this.state;

    if(commentObj.comment_text=="")
      return (
        <Fragment></Fragment>
      )

    return(
      <Box display="flex" mb={2} mt={1}>
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            autoHideDuration={2000}
            open={openSnackBar}
            onClose={() => this.handleSnackBarClose()}
        >
            {error || deleteError ? (
                <Alert severity="error">There was an error. Please try again.</Alert>
            ):(
              <Alert severity="success">Successfully done.</Alert>
            )}
        </Snackbar>
        <AvatarWrapper aria-label="name">
          {commentObj.user.first_name[0]}
        </AvatarWrapper>
        <CommentWrapper ml={1}>
          <FlexView alignItems="center" justify="space-between">
            <div>
              <Typography variant="body1" color="textPrimary">
                {commentObj.user.first_name}&nbsp;{commentObj.user.last_name}
              </Typography>
              <Typography variant="caption" color="textPrimary">
                {dateTime(commentObj.updated_on)}
              </Typography>
            </div>
            <FlexView alignItems="center">
              {cookie.get('user_id') === commentObj.user.id && this.renderPopUp(commentObj)}
            </FlexView>
          </FlexView>
          <br/>
          {edit ?
            this.renderEditComment(commentObj)
            :
            <Typography variant="body2" color="textPrimary">
              {commentObj.comment_text}
            </Typography>
          }
        </CommentWrapper>
      </Box>
    )
  }
}

const mapStateToProps = (state) => ({
  error: getError(state),
  pending: getStatus(state),
  success: getSuccess(state),
  deleteError: getDeleteError(state),
  deletePending: getDeleteStatus(state),
  deleteSuccess: getDeleteSuccess(state),
});
export default connect(
    mapStateToProps,
    dispatch => ({
      actions: bindActionCreators({fetchCommentDeleteDetails, fetchCommentEditDetails}, dispatch)
    })
)(CommentCard)