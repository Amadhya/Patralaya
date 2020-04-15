import React, {Fragment, PureComponent} from "react";
import { Typography } from '@material-ui/core';
import { connect  } from 'react-redux';
import { bindActionCreators } from 'redux';

import {Router} from "../../routes";
import {FlexView, Separator} from "../../components/layout";
import {ButtonLayout} from "../../components/button";
import TextFieldInput from "../../components/textfield";
import fetchSignUpDetails, {getSuccess, getError, getStatus} from "../../container/signup/saga";

const Form1 = [
  {
    id: 'first_name',
    label: 'First Name',
    type: 'text',
    name: 'First Name',
    autoComplete: 'fisrtName',
    autoFocus: true,
  },
  {
    id: 'last_name',
    label: 'Last Name',
    type: 'text',
    name: 'Last Name',
    autoComplete: 'lastName',
    autoFocus: false,
  },
];
const Form2 = [
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

class SignUp extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      form: {
        'first_name': '',
        'last_name': '',
        'phone': '',
        'email': '',
        'password': ''
      },
      isClicked: false,
      next: false,
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
              'first_name': '',
              'last_name': '',
              'phone': '',
              'email': '',
              'password': ''
            },
        }, () => {onClose();});
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

  handleNext = () => {
    const {form} = this.state;

    if(form['first_name'] ==='' && form['last_name'] ===''){
        this.setState({
            emptyFields: true,
        })
    }else{
        this.setState({
            next: true,
            emptyFields: false,
        });
    }
  }

  handleNextBack = () => {
    this.setState({
        next: false,
        emptyFields: false,
    });
  }

  onSubmit = () => {
    const {form} = this.state;
    const {actions} = this.props;

    if(form['password'] !=='' && form['email'] !=='')
        actions.fetchSignUpDetails(form);
    else{
      this.setState({
        emptyFields: true,
      });
    }

    this.setState({
      isClicked: true,
    });
  };

  render() {
    const {isClicked, form, next, emptyFields} = this.state;
    const {error, handleBack} = this.props;

    return (
      <FlexView reverse={true} alignItems="center" justify="center">
        <Typography component="h1" variant="h5" align="center">
          Sign Up with Email
        </Typography>
        <Separator/>
        <Typography variant="body1" align="center">
          Enter the following details to create an account at Patralaya.
        </Typography>
        <Separator/>
        {next ? (
            <Fragment>
                {Form2.map(obj => (
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
                <Separator/>
                {isClicked && emptyFields && (
                  <Fragment>
                    <Typography variant="caption" color="error" align="left">
                      Please fill all the required fields*.
                    </Typography>
                    <Separator height={2}/>
                  </Fragment>
                )}
                {isClicked && error !== null && (
                    <Fragment>
                        <Typography variant="caption" color="error">
                            {error}
                        </Typography>
                        <Separator/>
                    </Fragment>
                )}
                <ButtonLayout variant="contained" color="primary" onClick={() => this.onSubmit()}>
                    Sign Up
                </ButtonLayout>
                <Separator/>
                <ButtonLayout onClick={() => this.handleNextBack()}>
                    Go back
                </ButtonLayout>
            </Fragment>
        ) : (
            <Fragment>
                {Form1.map(obj => (
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
                {emptyFields && (
                  <Fragment>
                    <Typography variant="caption" color="error" align="left">
                      Please fill all the required fields*.
                    </Typography>
                    <Separator height={2}/>
                  </Fragment>
                )}
                <Separator/>
                <ButtonLayout variant="contained" color="primary" onClick={() => this.handleNext()}>
                    Next
                </ButtonLayout>
                <Separator/>
                <ButtonLayout onClick={handleBack}>
                    Go back
                </ButtonLayout>
            </Fragment>
        )}
    </FlexView>
    );
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
      actions: bindActionCreators({fetchSignUpDetails}, dispatch)
    })
)(SignUp);