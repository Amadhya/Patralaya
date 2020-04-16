import React, {PureComponent, Fragment} from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import {
  Typography, TextField, Snackbar, Menu, MenuItem, Avatar, IconButton, Button
} from '@material-ui/core';
import styled from 'styled-components';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ThumbUpAltRoundedIcon from '@material-ui/icons/ThumbUpAltRounded';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import MuiAlert from '@material-ui/lab/Alert';
import cookie from 'js-cookie';

import {Router} from "../../../routes";
import fetchLikeDetails from "../../../container/like/saga";
import fetchBlogEditDetails, {getSuccess, getError, getStatus} from "../../../container/edit-blog/saga";
import fetchBlogDeleteDetails, {getDeleteStatus, getDeleteError, getDeleteSuccess} from "../../../container/delete-blog/saga";
import fetchUnlikeDetails from "../../../container/unlike/saga";
import {ButtonLayout} from "../../../components/button";
import SocialShare from "../../../components/social_share";
import Theme from "../../../constants/theme";
import {Row, Col, HrWrapper, Separator} from "../../../components/layout";

const IconButtonWrapper = styled(IconButton)`
  margin-right: 0.5rem !important;
  border: 1px solid ${Theme.grey} !important;
`;
const AvatarWrapper = styled(Avatar)`
  background-color: #f44336 !important;
  width: 2.4rem !important;
  height: 2.4rem !important;
  margin-right: 0.1rem;
  @media(min-width: 767px){
    width: 3rem !important;
    height: 3rem !important;
    margin-right: 1rem;
  }
`;
const ColWrapper = styled(Col)`
  display: flex !important;
  @media(min-width: 767px){
    justify-content: flex-end;
  }
`;
const MenuWrapper = styled(Menu)`
  margin-top: 3rem;
`;
const TypographyWrapper = styled(Typography)`
  padding-right: 2rem;
  @media(max-width: 767px){
    padding-right: 0.5rem;
  }
`;
const TagsWrapper = styled(ButtonLayout)`
  margin-right: 1rem !important;
  margin-bottom: 1rem !important;
`;

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const url = 'http://localhost:3000/blog/'

function dateTime (t){
  let newDate=new Date(t);

  let date = newDate.getDate();
  let month = newDate.getMonth();
  let year = newDate.getFullYear();
  let hour = newDate.getHours();
  let min = newDate.getMinutes(); 

  return `${monthNames[month]} ${date}, ${year} at ${hour}:${min} (IST)`
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Content extends PureComponent {

  constructor(props){
    super(props);
    this.state={
      like: false,
      unLike: false,
      noOfLikes: 0,
      anchorEl: null,
      isDeleted: false,
      editText: '',
      editTitle: '',
      edit: false,
      openSnackBar: false,
    };
  }

  componentDidMount() {
    const {likes} = this.props;

    if(typeof window !== "undefined" && likes){
      const userId = cookie.get('user_id');
      const obj = likes.find(item => item.user.id === userId);

      if(typeof obj !== "undefined"){
        this.setState({
          like: true,
          noOfLikes: likes.length,
        });
      }else{
        this.setState({
          noOfLikes: likes.length,
        });
      }
    }
  }

  componentDidUpdate(){
    const {deletePending, deleteSuccess, deleteError, success, pending, error} = this.props;
    const {isDeleted, edit} = this.state;

    if(isDeleted && typeof deletePending !== "undefined" && typeof deleteSuccess !== "undefined" && !deletePending && deleteSuccess)
        Router.pushRoute('blog_feed');

    if(isDeleted && deleteError){
      this.setState({
        isDeleted: false,
        openSnackBar: true,
      });
    }

    if(edit && typeof pending !== "undefined" && typeof success !== "undefined" && !pending && success){
      this.setState({
        editText: '',
        editTitle: '',
        edit: false,
        openSnackBar: true,
      });
    }

    if(edit && error){
      this.setState({
        openSnackBar: true,
      });
    }
  }

  onLikeButtonClick = () => {
    const {like, noOfLikes} = this.state;
    const {actions, blog, loggedIn} = this.props;

    if(!loggedIn){
      this.setState({
        openSnackBar: true,
      });
    }else if(typeof window !== "undefined"){

      if(!like){
        actions.fetchLikeDetails(blog.id);
        this.setState({
          like: true,
          noOfLikes: noOfLikes+1,
        })
      }else {
        actions.fetchUnlikeDetails(blog.id);
        this.setState({
          noOfLikes: noOfLikes-1,
          like: false,
        });
      }
    }
  };

  onViewProfile = (id) => {
    Router.pushRoute(`/profile/${id}`);
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
    const {actions, blog} = this.props;

    this.handleClose();
    actions.fetchBlogDeleteDetails(blog.id);
  };

  handleEditBlog = () => {
    const {blog} = this.props;

    this.handleClose();
    this.setState({
      editText: blog.blog_text,
      editTitle: blog.title,
      edit: true,
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
        <MenuWrapper
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
        </MenuWrapper>
      </div>
    );
  };

  onEditBlogTextChange = (event) => {
    this.setState({
      editText: event.target.value,
    })
  };

  onEditBlogTitleChange = (event) => {
    this.setState({
      editTitle: event.target.value,
    })
  };

  saveEditedBlog = () => {
    let {blog, actions} = this.props;
    const {editText, editTitle} = this.state;

    blog.blog_text = editText;
    blog.title = editTitle;

    actions.fetchBlogEditDetails(blog.id, editText, editTitle);
  };

  renderEditBlog = () => {
    const {editText, editTitle} = this.state;

    return(
        <Fragment>
          <TextField
              id="title"
              label="Edit blog Title...."
              multiline
              margin="normal"
              variant="outlined"
              fullWidth
              autoFocus={true}
              value={editTitle}
              onChange={e => this.onEditBlogTitleChange(e)}
          />
          <Separator/>
          <TextField
              id="blog_text"
              label="Edit blog...."
              multiline
              margin="normal"
              variant="outlined"
              fullWidth
              value={editText}
              onChange={e => this.onEditBlogTextChange(e)}
          />
          <Separator/>
          <ButtonLayout variant="outlined" color="primary" onClick={() => this.saveEditedBlog()}>
            Save
          </ButtonLayout>
          <Separator/>
        </Fragment>
    );
  };

  handleSnackBarClose = () => {
    this.setState({
        openSnackBar: false,
    })
  };

  renderSnackBar = () => {
    const {error, loggedIn} = this.props;
    const {deleteError} = this.state;

    if(error || deleteError)
      return <Alert severity="error">There was an error. Please try again.</Alert>

    if(!loggedIn)
      return <Alert severity="info">Please login to like the blog.</Alert>

    return <Alert severity="success">Blog was successfully edited.</Alert>
  }


  render() {
    const {blog, tags} = this.props;
    const {like, noOfLikes, edit, openSnackBar} = this.state;

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
            {this.renderSnackBar()}
        </Snackbar>
        {edit ? this.renderEditBlog() 
          : 
          <Fragment>
            <Typography variant="h4" gutterBottom>
                {blog.title}
            </Typography>
            <Separator/>
            <Row>
                <Col sm={8} xs={11}>
                    <Row alignItems="center">
                        <AvatarWrapper aria-label="name">
                            {blog.user.first_name[0]}
                        </AvatarWrapper>
                        <Col>
                            <Typography variant="body1">
                                {blog.user.first_name+' '+blog.user.last_name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {dateTime(blog.created_on)}
                            </Typography>
                        </Col>
                    </Row>
                </Col>
                <ColWrapper sm={4} xs={1}>
                  <SocialShare 
                    url={url+blog.id} 
                    title={blog.title} 
                    text={'Checkout this blog by '+blog.user.first_name+' '+blog.user.last_name+' at Patralaya'}
                    disp='desktop'
                  />
                  {cookie.get('user_id') === blog.user.id && this.renderPopUp()}
                </ColWrapper>
            </Row>
            <SocialShare 
              url={url+blog.id} 
              title={blog.title} 
              text={'Checkout this blog by '+blog.user.first_name+' '+blog.user.last_name+' at Patralaya'}
              disp='mobile'
            />
            <Separator/>
            <TypographyWrapper variant="body1">
                {blog.blog_text}
            </TypographyWrapper>
            <Separator/>
            <Row>
              {tags.map(item => (
                <TagsWrapper key={item} variant="outlined" color="primary">
                  {item}
                </TagsWrapper>
              ))}
            </Row>
            <Separator/>
            <Row>
                <Col md={6} sm={12} xs={12}>
                    <Row alignItems="center">
                        <IconButtonWrapper onClick={() => this.onLikeButtonClick()}>
                            {like ? <ThumbUpAltRoundedIcon/> : <ThumbUpAltOutlinedIcon/>}
                        </IconButtonWrapper>
                        {like ? (
                                <Typography variant="body1" color="textSecondary">Liked by you {noOfLikes-1 !=0 && `and ${noOfLikes-1} others`}</Typography>
                            ):(
                                <Typography variant="body1" color="textSecondary">{noOfLikes} likes</Typography>
                            )   
                        }
                    </Row>
                </Col>
                <Col md={6} sm={12} xs={12}>
                  <SocialShare 
                    url={url+blog.id} 
                    title={blog.title} 
                    text={'Checkout this blog by '+blog.user.first_name+' '+blog.user.last_name+' at Patralaya'}
                  />
                </Col>
            </Row>
          </Fragment>
        }
        <Separator/>
        <HrWrapper/>
        <Separator/>
        <Row>
            <Col sm={8} xs={10}>
                <Row alignItems="center">
                    <AvatarWrapper aria-label="name">
                        {blog.user.first_name[0]}
                    </AvatarWrapper>
                    <Col>
                        <Typography variant="body1" color="textSecondary">
                            Written By
                        </Typography>
                        <Typography variant="h6">
                            {blog.user.first_name+' '+blog.user.last_name}
                        </Typography>
                    </Col>
                </Row>
            </Col>
            <ColWrapper sm={4} xs={2}>
              <ButtonLayout onClick={() => this.onViewProfile(blog.user.id)}>View Profile</ButtonLayout>
            </ColWrapper>
        </Row>
        <Separator/>
        <HrWrapper/>
        <Separator/>
      </div>
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

export default withRouter(connect(
    mapStateToProps,
    dispatch => ({
      actions: bindActionCreators({fetchLikeDetails, fetchUnlikeDetails, fetchBlogEditDetails, fetchBlogDeleteDetails}, dispatch)
    }),
)(Content));