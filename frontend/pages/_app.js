import React from 'react'

import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from "../reducers";
import Nav from "../components/nav";

const middlewares = [thunk];
export const store = createStore(rootReducer,{},applyMiddleware(logger, ...middlewares));

class MyApp extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = {
      loggedIn: !!(typeof window !== 'undefined' && localStorage.getItem('token')),
    };
  }

  static getDerivedStateFromProps(props, state){
    if(typeof window !== 'undefined'){
      return {
        loggedIn: !!(localStorage.getItem('token')),
      }
    }
    return state;
  }

  handleLogout = () => {
    if(typeof window !== 'undefined'){
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      this.setState({ loggedIn: false });
      Router.pushRoute('login');
    }
  };

  render(){
    const {Component, pageProps} = this.props;
    const {loggedIn} = this.state;

    return(
      <Provider store={store}>
        <Nav handleLogout={() => this.handleLogout()} loggedIn={loggedIn}/>
        <main>
          <Component loggedIn={loggedIn} {...pageProps} />
        </main>
      </Provider>
    )
  }
}

export default MyApp;