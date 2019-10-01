import React, {PureComponent} from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Avatar, Button, Card, CardContent, CardHeader, Typography, Box} from "@material-ui/core";
import styled from "styled-components";
import {FlexView} from "../../components/layout";
import ThumbUpAltRoundedIcon from '@material-ui/icons/ThumbUpAltRounded';
import QuestionAnswerRoundedIcon from '@material-ui/icons/QuestionAnswerRounded';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';

import Comment from "./comment";
import fetchLikeDetails, {getSuccess, getError, getStatus} from "../../container/like/saga";
import fetchUnlikeDetails from "../../container/unlike/saga";

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
    }
  }

  componentDidMount() {
    const {postObj} = this.props;

    if(typeof window !== "undefined"){
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

  render() {
    const {postObj} = this.props;
    const {showComments, like, noOfLikes} = this.state;

    return(
      <CardWrapper key={postObj.post.post_text}>
        <CardHeader
            avatar={
              <AvatarWrapper aria-label="name">
                {postObj.post.user.first_name[0]}
              </AvatarWrapper>
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
      actions: bindActionCreators({fetchLikeDetails, fetchUnlikeDetails}, dispatch)
    }),
)(PostCard);