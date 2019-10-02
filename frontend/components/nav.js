import React from 'react';
import RateReviewRoundedIcon from '@material-ui/icons/RateReviewRounded';

import Router,{Link} from "../routes";

class Nav extends React.PureComponent{
  constructor(props){
    super(props);
    this.state={
      loggedIn: undefined,
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      loggedIn: props.loggedIn === undefined ? props.loggedIn : (!!(typeof window !== 'undefined' && localStorage.getItem('token'))),
    }
  }

  handleLoginClick = () => {
    Router.pushRoute('login');
  };

  render() {
    const {loggedIn} = this.state;
    console.log(loggedIn, '-------------------------------------------------------');

    return(
      <nav>
        <div>
          <RateReviewRoundedIcon fontSize="large"/>
          <Link route="feed">
            <h1>
              Patralaya
            </h1>
          </Link>
        </div>
        {loggedIn &&
          <div>
            <Link route="profile">
              <h3>
                Profile
              </h3>
            </Link>
            <h3 onClick={() => this.props.handleLogout()}>
              Logout
            </h3>
          </div>
        }
        {!loggedIn &&
          <div>
            <Link route="signup">
              <h3>
                SignUp
              </h3>
            </Link>
            <Link route="login">
              <h3>
                Login
              </h3>
            </Link>
          </div>
        }
        <style jsx>{`
          :global(body) {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
              Helvetica, sans-serif;
          }
          nav {
            display: flex;
            align-items: center;
            justify-content: space-around;
            text-align: center;
            box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12);
            margin-bottom: 3rem;
            position: fixed;
            width: 100%;
            background: linear-gradient(56.99deg,#f50057 0%,#ff3f3f 100%);
            color: white;
          }
          div {
            display: flex;
            align-items: center;
          }
          h3 {
            margin: 0px 1rem;
          }
          h1{
            margin-left: 5px;
          }
          a{
            color: white;
            text-decoration: none;
          }
          
        `}</style>
      </nav>
    )
  }
}

export default Nav
