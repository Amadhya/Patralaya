import React, {PureComponent} from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {TextField, Snackbar} from "@material-ui/core";
import CommentCard from "./comment_card";
import MuiAlert from '@material-ui/lab/Alert';

import fetchNewCommentDetails, {getNewComment, getSuccess, getError, getStatus} from "../../../container/new-comment/saga";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class CommentsSection extends PureComponent{
  
  constructor(props){
    super(props);
    this.state={
      comment_text: '',
      isClicked: false,
      newCommentList: this.props.blogComments,
      openSnackBar: false,
    };
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
    const {blogId, actions, loggedIn} =this.props;
    const {comment_text} = this.state;

    if(!loggedIn){
      this.setState({
        openSnackBar: true,
      })
    }else{
      actions.fetchNewCommentDetails(blogId,comment_text);

      this.setState({
        comment_text: '',
        isClicked: true,
      });
    }
  };

  handleSnackBarClose = () => {
    this.setState({
        openSnackBar: false,
    })
  };

  render() {
    const {comment_text, newCommentList, openSnackBar} = this.state;

    return(
      <div>
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            autoHideDuration={2500}
            open={openSnackBar}
            onClose={() => this.handleSnackBarClose()}
        >
            <Alert severity="info">Please login to add a comment.</Alert>
        </Snackbar>
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
        {newCommentList.map(item => (
            <CommentCard commentObj={item} key={item.id}/>
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
)(CommentsSection)