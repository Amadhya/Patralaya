import React, {PureComponent} from 'react';
import {
    Dialog, DialogContent, DialogContentText, IconButton, Typography
} from '@material-ui/core';
import styled from 'styled-components';
import { GoogleLogin } from 'react-google-login';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import fetchGoogleLoginDetails, {getSuccess, getError, getStatus} from "../../container/google_login/saga";
import {Separator, FlexView} from "../../components/layout";
import {ButtonLayout} from "../../components/button";
import Login from "./login";
import SignUp from "./signup";
import {Router} from "../../routes";

const IconButtonWrapper = styled(IconButton)`
    float: right;
    padding: 0px !important;
`;
const DialogContentWrapper = styled(DialogContent)`
    padding: 0 5rem 2rem 5rem !important;
    @media(max-width: 769px){
        padding: 0 2rem 1rem 2rem !important;
    }
`;
const ButtonWrapper = styled(ButtonLayout)`
  text-transform: capitalize !important;
`;

class Auth extends PureComponent{

    constructor(props){
        super(props);
        this.state ={
            googleLoginError: false,
            googleLogin: false,
            signin: false,
            signup: false,
        };
    }

    componentDidUpdate(){
        const {success, pending, handleClose} = this.props;
        const {googleLogin} = this.state;

        if(googleLogin && typeof pending !== "undefined" && typeof success !== "undefined" && !pending && success){
            this.setState({
                googleLogin: false,
            });
            Router.pushRoute('blog_feed');
            handleClose();
        }
    }

    googleResponse = (response) => {
        const {actions} = this.props;
        const {accessToken} = response;

        this.setState({
            googleLogin: true,
        });
    
        actions.fetchGoogleLoginDetails(accessToken)
    }

    onFailure = () => {
        this.setState({
            googleLoginError: true,
        })
    }

    handleSignIn = () => {
        this.setState({
            signin: true,
        });
    }

    handleSignUp = () => {
        this.setState({
            signup: true,
        });
    }

    handleBack = () => {
        this.setState({
            signup: false,
            signin: false,
        });
    }

    render(){
        const {open, handleClose} = this.props;
        const {signin, signup} = this.state;

        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <MuiDialogTitle disableTypography>
                    <IconButtonWrapper aria-label="close" onClick={handleClose}>
                        <CloseIcon />
                    </IconButtonWrapper>
                </MuiDialogTitle>
                <DialogContentWrapper>
                    {signin && <Login onClose={handleClose} handleBack={() => this.handleBack()}/>}
                    {signup && <SignUp onClose={handleClose} handleBack={() => this.handleBack()}/>}
                    {!signin && !signup &&
                        <FlexView reverse alignItems="center">
                            <Typography variant="h5" gutterBottom align="center">Welcome to Patralaya</Typography>
                            <Separator/>
                            <DialogContentText align="center">
                                Sign in to Patralaya to read blogs of various topics you love and get to
                                interact with blogs.
                            </DialogContentText>
                            <Separator/>
                            <GoogleLogin
                                clientId=""
                                buttonText="Sign in with Google"
                                onSuccess={() => this.googleResponse()}
                                onFailure={() => this.onFailure()}
                            /> 
                            <Separator/> 
                            <ButtonLayout
                                variant="outlined"
                                startIcon={<EmailRoundedIcon/>}
                                onClick={() => this.handleSignIn()}
                            >
                                Sign in with email
                            </ButtonLayout>
                            <Separator/> 
                            <ButtonWrapper
                                onClick={() => this.handleSignUp()}
                            >
                                Don't have an account? Sign Up.
                            </ButtonWrapper>
                        </FlexView>
                    }
                </DialogContentWrapper>
            </Dialog>
        )
    }
};

const mapStateToProps = (state) => ({
    error: getError(state),
    pending: getStatus(state),
    success: getSuccess(state),
  });
  export default connect(
      mapStateToProps,
      dispatch => ({
        actions: bindActionCreators({fetchGoogleLoginDetails}, dispatch)
      })
  )(Auth);