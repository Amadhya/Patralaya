import React, {PureComponent, Fragment} from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Avatar, Button, Card, CardContent, CardHeader, Typography, Box, TextField} from "@material-ui/core";
import styled from "styled-components";
import {FlexView} from "../../components/layout";
import ThumbUpAltRoundedIcon from '@material-ui/icons/ThumbUpAltRounded';
import QuestionAnswerRoundedIcon from '@material-ui/icons/QuestionAnswerRounded';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import cookie from 'js-cookie';

import {Link, Router} from "../../routes";
import Comment from "./[id]/comment";
import fetchLikeDetails, {getSuccess, getError, getStatus} from "../../container/like/saga";
import fetchBlogDeleteDetails from "../../container/delete-blog/saga";
import fetchUnlikeDetails from "../../container/unlike/saga";
import fetchBlogEditDetails from "../../container/edit-blog/saga";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const CardWrapper = styled(Card)`
  margin: 20px;
`;
const AvatarWrapper = styled(Avatar)`
  margin: auto;
  background-color: #f44336 !important;
`;
const Separator = styled.div`
  border-bottom: 1px solid gainsboro;
`;
const Icon = styled(Button)`
  margin-right: 5px;
  padding-right: 5px;
  border-right: 1px solid gainsboro;
`;
const TypographyWrapper = styled(Typography)`
  margin-left: 7px !important;
  @media(max-width: 767px){
    display: none;
  }
`;
const ButtonWrapper = styled(Button)`
  float: right;
`;

class BlogCard extends PureComponent{
  constructor(props){
    super(props);
    this.state = {
      showComments: false,
      isClicked: false,
      like: false,
      unLike: false,
      noOfLikes: 0,
      anchorEl: null,
      isDeleted: false,
      editText: '',
    }
  }

  componentDidMount() {
    const {blogObj} = this.props;

    if(typeof window !== "undefined" && blogObj && blogObj.likes){
      const userId = cookie.get('user_id');
      const obj = blogObj.likes.find(item => item.user.id === userId);

      if(typeof obj !== "undefined"){
        this.setState({
          like: true,
          noOfLikes: blogObj.likes.length,
        });
      }else{
        this.setState({
          noOfLikes: blogObj.likes.length,
        });
      }
    }
  }

  onCommentButtonClick = () => {
    const {showComments} = this.state;

    this.setState({
      showComments: !showComments,
    })
  };

  onLikeButtonClick = () => {
    const {like, noOfLikes} = this.state;
    const {actions, blogObj} = this.props;

    if(typeof window !== "undefined"){

      if(!like){
        actions.fetchLikeDetails(blogObj.blog.id);
        this.setState({
          like: true,
          noOfLikes: noOfLikes+1,
        })
      }else {
        actions.fetchUnlikeDetails(blogObj.blog.id);
        this.setState({
          noOfLikes: noOfLikes-1,
          like: false,
        });
      }
    }
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

  handleDeleteBlog = () => {
    const {actions, blogObj} = this.props;

    this.handleClose();
    actions.fetchBlogDeleteDetails(blogObj.blog.id);
    this.setState({
      isDeleted: true,
    })
  };

  handleEditBlog = () => {
    const {blogObj} = this.props;

    this.handleClose();
    this.setState({
      editText: blogObj.blog.blog_text,
    });
  };

  renderPopUp = () => {
    const {anchorEl} = this.state;
    const open = Boolean(anchorEl);

    return (
      <div>
        <IconButton
            aria-label="edit blog"
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
          <MenuItem onClick={() => this.handleEditBlog()}>Edit</MenuItem>
          <MenuItem onClick={() => this.handleDeleteBlog()}>Delete</MenuItem>
        </Menu>
      </div>
    );
  };

  onEditBlogChange = (event) => {
    this.setState({
      editText: event.target.value,
    })
  };

  editBlog = () => {
    let {blogObj, actions} = this.props;
    const {editText} = this.state;

    blogObj.blog.blog_text = editText;
    actions.fetchBlogEditDetails(blogObj.blog.id, blogObj.blog.blog_text);

    this.setState({
      editText: '',
    })
  };

  renderEditBlog = () => {
    const {editText} = this.state;

    return(
        <Fragment>
          <TextField
              id="outlined-textarea"
              label="Edit blog...."
              multiline
              margin="normal"
              variant="outlined"
              fullWidth
              autoFocus={true}
              value={editText}
              onChange={e => this.onEditBlogChange(e)}
          />
          <ButtonWrapper variant="outlined" color="secondary" onClick={() => this.editBlog()}>
            Save
          </ButtonWrapper>
        </Fragment>
    );
  };

  render() {
    const {blogObj} = this.props;
    const {showComments, like, noOfLikes, isDeleted, editText} = this.state;

    if(isDeleted)
      return(
          <div></div>
      );

    return(
      <CardWrapper key={blogObj.blog.blog_text}>
        <CardHeader
            avatar={
              <AvatarWrapper aria-label="name">
                {blogObj.blog.user.first_name[0]}
              </AvatarWrapper>
            }
            action={
              cookie.get('user_id') === blogObj.blog.user.id && this.renderPopUp()
            }
            title={
              <Link to={'/profile/'+ blogObj.blog.user.id}>
                <Typography variant="body1">
                  {blogObj.blog.user.first_name+' '+blogObj.blog.user.last_name}
                </Typography>
              </Link>
            }
            subheader={new Date(blogObj.blog.created_on).toString()}
        />
        <CardContent>
          {editText !== '' ?
            this.renderEditBlog()
            :
            <Typography variant="body1" color="textSecondary" style={{whiteSpace: 'pre-line'}}>
              {blogObj.blog.blog_text}
            </Typography>
          }
        </CardContent>
        <Box ml={2} mr={2} mb={0.5}>
          <Typography variant="caption" color="textSecondary">
            {noOfLikes}&nbsp;likes
          </Typography>
          <Separator/>
          <FlexView>
            <Icon onClick={() => this.onLikeButtonClick()}>
              {like ? <ThumbUpAltRoundedIcon/> : <ThumbUpAltOutlinedIcon/>}
              <TypographyWrapper variant="subtitle1" color="textSecondary">
                {like ? 'Unlike': 'Like'}
              </TypographyWrapper>
            </Icon>
            <Icon onClick={() => this.onCommentButtonClick()}>
              <QuestionAnswerRoundedIcon/>
              <TypographyWrapper variant="subtitle1" color="textSecondary">
                Comment
              </TypographyWrapper>
            </Icon>
          </FlexView>
          {showComments && <Comment comments={blogObj.comments} blogId={blogObj.blog.id} />}
        </Box>
      </CardWrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  error: getError(state),
  pending: getStatus(state),
  success: getSuccess(state),
});
export default connect(
    mapStateToProps,
    dispatch => ({
      actions: bindActionCreators({fetchLikeDetails, fetchUnlikeDetails, fetchBlogDeleteDetails, fetchBlogEditDetails}, dispatch)
    }),
)(BlogCard);