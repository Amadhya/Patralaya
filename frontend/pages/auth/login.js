import React, { PureComponent, Fragment } from "react";
import Head from 'next/head'
import { Typography, Snackbar } from '@material-ui/core';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import MuiAlert from '@material-ui/lab/Alert';

import {FlexView, Separator} from "../../components/layout";
import {ButtonLayout} from "../../components/button";
import TextFieldInput from "../../components/textfield";
import {CircularProgressWrapper} from "../../components/progress";
import fetchLoginDetails, {getSucces, getError, getStatus} from "../../container/login/saga";

const Form = [
  {
    id: 'email',
    label: 'Email',
    type: 'text',
    name: 'Email',
    autoComplete: 'email',
    autoFocus: true,
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password',
    name: 'Password',
    autoComplete: 'password',
    autoFocus: false,
  },
];

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Login extends PureComponent{
 constructor(props){
   super(props);
   this.state={
      form: {
        'email': '',
        'password': ''
      },
      isClicked: false,
      emptyFields: false,
      openSnackBar: false,
   }
 }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { success, pending, onClose, error } = this.props;
    const { isClicked } = this.state;

    if(isClicked){
      if(typeof pending !== "undefined" && !pending && typeof success !== "undefined" && success){
        this.setState({
          isClicked: false,
          openSnackBar: true,
          form: {
            'email': '',
            'password': ''
          },
        });
        onClose();
      }else if(error){
        this.setState({
          isClicked: false,
          openSnackBar: true,
        })
      }
    }
  }

  handleChange = (id,val) => {
    const {form} = this.state;
    let temp = {};

    temp[id]=val;
    this.setState({
      form: {
        ...form,
        ...temp,
      }
    });
  };

  onSubmit = () => {
    const {form} = this.state;
    const {actions} = this.props;

    if(form['email'] !=='' && form['password'] !==''){
      this.setState({
        isClicked: true,
      });
      actions.fetchLoginDetails(form);
    }else{
      this.setState({
        isClicked: true,
        emptyFields: true,
      })
    };
  };

  handleSnackBarClose = () => {
    this.setState({
        openSnackBar: false,
    })
  }

 render() {
   const {isClicked, form, emptyFields, openSnackBar} = this.state;
   const {error, handleBack} = this.props;

   return (
    <FlexView reverse={true} alignItems="center" justify="center">
        <Head>
            <title>Sign In</title>
        </Head>
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            autoHideDuration={2000}
            open={ openSnackBar }
            onClose={() => this.handleSnackBarClose()}
        >
            {error ? (
                <Alert severity="error">There was an error in signing you up.</Alert>
            ):(
                <Alert severity="success">Signed In Successfully.</Alert>
            )}
        </Snackbar>
        <Typography component="h1" variant="h5" align="center">
            Sign in with Email
        </Typography>
        <Separator/>
        <Typography variant="body1" color="textSecondary" align="center">
            Enter the email and password associated with your account to sign in at Patralaya
        </Typography>
        <Separator/>
        {Form.map(obj => (
            <TextFieldInput
              id={obj.id}
              label={obj.label}
              type={obj.type}
              name={obj.name}
              value={form[obj.id]}
              autoComplete={obj.autoComplete}
              autoFocus={obj.autoFocus}
              onChange={(id,v) => this.handleChange(id,v)}
              key={obj.id}
            />
        ))}
        {isClicked && emptyFields && (
          <Fragment>
            <Typography variant="caption" color="error" align="left">
              Please fill all the required fields*.
            </Typography>
            <Separator height={2}/>
          </Fragment>
        )}
        <Separator/>
        {isClicked && error !== null && (
            <Fragment>
            <Typography variant="caption" color="error">
                {error}
            </Typography>
            <Separator/>
            </Fragment>
        )}
        <ButtonLayout 
          variant="contained" 
          endIcon={isClicked && !emptyFields && <CircularProgressWrapper/>}
          onClick={() => this.onSubmit()}
        >
          Sign In
        </ButtonLayout>
        <Separator/>
        <ButtonLayout onClick={handleBack}>
          Go back
        </ButtonLayout>
    </FlexView>
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