import React, { PureComponent, Fragment } from "react";
import Head from 'next/head'
import { Typography } from '@material-ui/core';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {Router} from "../../routes";
import {FlexView, Separator} from "../../components/layout";
import {ButtonLayout} from "../../components/button";
import TextFieldInput from "../../components/textfield";
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
   }
 }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { success, pending, onClose } = this.props;

    if(typeof pending !== "undefined" && !pending){
      if(typeof success !== "undefined" && success){
        this.setState({
          isClicked: false,
          form: {
            'email': '',
            'password': ''
          },
        }, () => {
          onClose();
        });
        Router.pushRoute('blog_feed');
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

    if(form['email'] !=='' && form['password'] !=='')
      actions.fetchLoginDetails(form);
    else{
      this.setState({
        emptyFields: true,
      })
    };

    this.setState({
      isClicked: true,
    });
  };

 render() {
   const {isClicked, form, emptyFields} = this.state;
   const {error, handleBack} = this.props;

   return (
    <FlexView reverse={true} alignItems="center" justify="center">
        <Head>
            <title>Log In</title>
        </Head>
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
        <ButtonLayout variant="contained" onClick={() => this.onSubmit()}>
          Log In
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