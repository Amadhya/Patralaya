import React, { PureComponent, Fragment } from "react";
import Head from 'next/head'
import { Button, Typography, Avatar } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import styled from 'styled-components';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {Router} from "../../routes";
import {FlexView} from "../../components/layout";
import TextFieldInput from "../../components/textfield";
import fetchLoginDetails, {getSucces, getError, getStatus} from "../../container/login/saga";


const FlexViewWrapper = styled(FlexView)`
  height: 97vh;
`;
const AvatarWrapper = styled(Avatar)`
  margin: 5px;
  background-color: #f50057 !important;
`;
const Container = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  width: 300px;
`;


class Login extends PureComponent{
 constructor(props){
   super(props);
   this.state={
     email: '',
     password: '',
     isClicked: false,
   }
 }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { success, pending } = this.props;

    if(typeof pending !== "undefined" && !pending){
      if(typeof success !== "undefined" && success){
        Router.pushRoute('feed');
      }
    }
  }

 handleEmailChange = (val) => {
   this.setState({
     email: val,
   });
 };

  handlePasswordChange = (val) => {
    this.setState({
      password: val,
    });
  };

  onSubmit = () => {
    const {email, password} = this.state;
    const {actions} = this.props;
    actions.fetchLoginDetails(email,password);
    this.setState({
      isClicked: true,
      email: '',
      password: '',
    });
  };

 render() {
   const {isClicked, email, password} = this.state;
   const {error} = this.props;
   return (
     <FlexViewWrapper reverse={true} alignItems="center" justify="center">
       <Head>
         <title>Log In</title>
       </Head>
       <AvatarWrapper>
         <LockOutlinedIcon/>
       </AvatarWrapper>
       <Typography component="h1" variant="h5">
         Log in
       </Typography>
       <Container noValidate autoComplete="off">
         <TextFieldInput
             id="outlined-email-input"
             label="Email"
             type="email"
             name="email"
             value={email}
             autoComplete="email"
             autoFocus
             onChange={v => this.handleEmailChange(v)}
         />
         <TextFieldInput
             id="outlined-password-input"
             label="Password"
             type="password"
             name="password"
             value={password}
             autoComplete="current-password"
             onChange={v => this.handlePasswordChange(v)}
         />
         <br />
         {isClicked && error !== null && (
             <Fragment>
               <Typography variant="caption" color="error">
                 {error}
               </Typography>
               <br/>
             </Fragment>
         )}
         <Button variant="contained" color="primary" onClick={() => this.onSubmit()}>
           Log In
         </Button>
       </Container>
     </FlexViewWrapper>
   );
 }
}

const mapStateToProps = (state) => ({
  error: getError(state),
  pending: getStatus(state),
  success: getSucces(state),
});
export default connect(
    mapStateToProps,
    dispatch => ({
      actions: bindActionCreators({fetchLoginDetails}, dispatch)
    })
)(Login);