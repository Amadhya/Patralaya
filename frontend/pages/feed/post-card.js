import React, {PureComponent} from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Avatar, Button, Card, CardContent, CardHeader, Typography, Box} from "@material-ui/core";
import styled from "styled-components";
import {FlexView} from "../../components/layout";
import ThumbUpAltRoundedIcon from '@material-ui/icons/ThumbUpAltRounded';
import QuestionAnswerRoundedIcon from '@material-ui/icons/QuestionAnswerRounded';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import Comment from "./comment";
import fetchLikeDetails, {getSuccess, getError, getStatus} from "../../container/like/saga";
import fetchPostDeleteDetails from "../../container/delete-post/saga";
import fetchUnlikeDetails from "../../container/unlike/saga";
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

class PostCard extends PureComponent{
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
    }
  }

  componentDidMount() {
    const {postObj} = this.props;

    if(typeof window !== "undefined" && postObj){
      const userId = localStorage.getItem('user_id');
      const obj = postObj.likes.find(item => item.user.id === userId);

      if(typeof obj !== "undefined"){
        this.setState({
          like: true,
          noOfLikes: postObj.likes.length,
        });
      }else{
        this.setState({
          noOfLikes: postObj.likes.length,
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
    const {actions, postObj} = this.props;

    if(typeof window !== "undefined"){
      const userId = localStorage.getItem('user_id');

      if(!like){
        actions.fetchLikeDetails(postObj.post.id, userId);
        this.setState({
          like: true,
          noOfLikes: noOfLikes+1,
        })
      }else {
        actions.fetchUnlikeDetails(postObj.post.id, userId);
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

  handleDeletePost = () => {
    const {actions, postObj} = this.props;

    actions.fetchPostDeleteDetails(postObj.post.id);
    this.setState({
      isDeleted: true,
    })
  };

  renderPopUp = () => {
    const {anchorEl} = this.state;
    const open = Boolean(anchorEl);

    return (
      <div>
        <IconButton
            aria-label="account of current user"
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
          <MenuItem>Edit</MenuItem>
          <MenuItem onClick={() => this.handleDeletePost()}>Delete</MenuItem>
        </Menu>
      </div>
    );
  };

  render() {
    const {postObj} = this.props;
    const {showComments, like, noOfLikes, isDeleted} = this.state;

    if(isDeleted)
      return(
          <div></div>
      );

    return(
      <CardWrapper key={postObj.post.post_text}>
        <CardHeader
            avatar={
              <AvatarWrapper aria-label="name">
                {postObj.post.user.first_name[0]}
              </AvatarWrapper>
            }
            action={
               localStorage.getItem('user_id') === postObj.post.user.id && this.renderPopUp()
            }
            title={postObj.post.user.first_name+' '+postObj.post.user.last_name}
            subheader={new Date(postObj.post.created_on).toString()}
        />
        <CardContent>
          <Typography variant="body1" color="textSecondary" component="p">
            {postObj.post.post_text}
          </Typography>
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
          {showComments && <Comment comments={postObj.comments} postId={postObj.post.id} />}
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
      actions: bindActionCreators({fetchLikeDetails, fetchUnlikeDetails, fetchPostDeleteDetails}, dispatch)
    }),
)(PostCard);