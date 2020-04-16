import React from 'react'

import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import nextCookie from 'next-cookies';
import cookie from 'js-cookie';

import {Router} from "../routes";
import rootReducer from "../reducers";
import Nav from "../components/nav";

const middlewares = [thunk];
export const store = createStore(rootReducer,{},applyMiddleware(logger, ...middlewares));

const privateUrl = [
  "/write_blog",
  "/settings",
  "/profile/[id]"
];

class MyApp extends React.PureComponent{

  static async getInitialProps({Component, ctx}){
    let pageProps = {};
    const {pathname} = ctx;
    const { token } = nextCookie(ctx)

    if(Component.getInitialProps){
      pageProps = await Component.getInitialProps(ctx);
    } 

    if(typeof token === "undefined"){
      var found = privateUrl.find(function(element) { 
        return element == pathname; 
      });
      if (found || pathname === "/"){
        if (typeof window === 'undefined') {
          ctx.res.writeHead(302, { Location: '/blog_feed' })
          ctx.res.end()
        } else {
          Router.push('/blog_feed')
        }
      }
    }

    const loggedIn = !(typeof token === "undefined");

    return {
      pageProps,
      loggedIn, 
    };
  }

  handleLogout = () => {
    if(typeof window !== 'undefined'){
      cookie.remove('token')
      cookie.remove('user_id');
      this.setState({ loggedIn: false });
      Router.pushRoute('blog_feed');
    }
  };

  render(){
    const {Component, pageProps, loggedIn} = this.props;

    console.log(loggedIn, 'in app---');

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