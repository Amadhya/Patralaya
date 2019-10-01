import React, {Fragment, PureComponent} from "react";
import { Button, Typography, Avatar } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {Router} from "../../routes";
import {FlexView, Row, Col} from "../../components/layout";
import TextFieldInput from "../../components/textfield";
import fetchSignUpDetails, {getSuccess, getError, getStatus} from "../../container/signup/saga";

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


class SignUp extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      email: '',
      password: '',
      firstName: '',
      lastName: '',
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

  handleFirstNameChange = (val) => {
    this.setState({
      firstName: val,
    });
  };

  handleLastNameChange = (val) => {
    this.setState({
      lastName: val,
    });
  };

  onSubmit = () => {
    const {email, password, firstName, lastName} = this.state;
    const {actions} = this.props;

    actions.fetchSignUpDetails(email, password, firstName, lastName);
    this.setState({
      isClicked: true,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
  };

  render() {
    const {isClicked, firstName, lastName, email, password} = this.state;
    const {error} = this.props;

    return (
      <FlexViewWrapper reverse={true} alignItems="center" justify="center">
        <AvatarWrapper>
          <LockOutlinedIcon/>
        </AvatarWrapper>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Container noValidate autoComplete="off">
          <Row>
            <Col sm={6} xs={12}>
              <TextFieldInput
                id="outlined-text-first-name-input"
                label="First Name"
                type="text"
                name="First Name"
                value={firstName}
                autoComplete="email"
                onChange={v => this.handleFirstNameChange(v)}
              />
            </Col>
            <Col sm={6} xs={12}>
              <TextFieldInput
                id="outlined-text-last-name-input"
                label="Last Name"
                type="text"
                name="Last Name"
                value={lastName}
                autoComplete="Last Name"
                onChange={v => this.handleLastNameChange(v)}
              />
            </Col>
          </Row>
          <TextFieldInput
              id="outlined-email-input"
              label="Email"
              type="email"
              name="email"
              value={email}
              autoComplete="email"
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
            Sign Up
          </Button>
        </Container>
      </FlexViewWrapper>
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