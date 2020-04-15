import React, {PureComponent} from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Box, TextField, Avatar} from "@material-ui/core";
import styled from 'styled-components';
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CommentCard from "./comment_card";

import fetchNewCommentDetails, {getNewComment, getSuccess, getError, getStatus} from "../../../container/new-comment/saga";
import {ButtonLayout} from "../../../components/button";

class CommentsSection extends PureComponent{
  
  constructor(props){
    super(props);
    this.state={
      comment_text: '',
      isClicked: false,
      newCommentList: this.props.blogComments,
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
      
    }else{
      actions.fetchNewCommentDetails(blogId,comment_text);

      this.setState({
        comment_text: '',
        isClicked: true,
      });
    }
  };

  render() {
    const {comment_text, newCommentList} = this.state;

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