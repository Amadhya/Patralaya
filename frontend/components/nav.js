import React from 'react';
import RateReviewRoundedIcon from '@material-ui/icons/RateReviewRounded';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import EditIcon from '@material-ui/icons/Edit';
import PollIcon from '@material-ui/icons/Poll';
import MovieIcon from '@material-ui/icons/Movie';
import AndroidIcon from '@material-ui/icons/Android';
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded';
import RestaurantRoundedIcon from '@material-ui/icons/RestaurantRounded';
import GradeIcon from '@material-ui/icons/Grade';
import BubbleChartRoundedIcon from '@material-ui/icons/BubbleChartRounded';

import styled from 'styled-components';

import {Link} from "../routes";
import DehazeIcon from '@material-ui/icons/Dehaze';
import {Typography} from "@material-ui/core";

const ListWrapper = styled.div`
  display: block;
`;
const NavWrapper = styled.div`
  margin: 0 1rem;
`;

const Categories = [
  {
    title: 'Entertainment',
    icon: MovieIcon,
  },
  {
    title: 'Fashion',
    icon: GradeIcon,
  },
  {
    title: 'Food',
    icon: RestaurantRoundedIcon,
  },
  {
    title: 'Literature',
    icon: EditIcon,
  },
  {
    title: 'Politics',
    icon: PollIcon,
  },
  {
    title: 'Science',
    icon: BubbleChartRoundedIcon,
  },
  {
    title: 'Technology',
    icon: AndroidIcon,
  },
  {
    title: 'Travel',
    icon: FlightTakeoffIcon,
  }
];

class Nav extends React.PureComponent{
  constructor(props){
    super(props);
    this.state={
      loggedIn: undefined,
      anchorEl: null,
      left: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      loggedIn: props.loggedIn === undefined ? props.loggedIn : (!!(typeof window !== 'undefined' && localStorage.getItem('token'))),
    }
  }

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

  handleLogout = () => {
    this.setState({
      anchorEl: null,
    });
    this.props.handleLogout()
  };

  render() {
    const {loggedIn, anchorEl} = this.state;
    const open = Boolean(anchorEl);

    const toggleDrawer = (side, open) => event => {
      if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }

      this.setState({ ...this.state, [side]: open });
    };

    const sideList = side => (
        <NavWrapper
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
          <br/>
          <Typography variant="h5" color="textSecondary" align="center" gutterBottom>Categories</Typography>
          <Divider />
          <List>
            {Categories.map(obj => (
                <ListItem button key={obj.title}>
                  <ListItemIcon><obj.icon/></ListItemIcon>
                  <ListItemText primary={obj.title} />
                </ListItem>
            ))}
          </List>
        </NavWrapper>
    );

    return(
      <nav>
        <div>
          <DehazeIcon onClick={toggleDrawer('left', true)}/>
          <SwipeableDrawer
              open={this.state.left}
              onClose={toggleDrawer('left', false)}
              onOpen={toggleDrawer('left', true)}
          >
            {sideList('left')}
          </SwipeableDrawer>
        </div>
        <div>
          <RateReviewRoundedIcon fontSize="large"/>
          <Link route="feed">
            <h1>
              Patralaya
            </h1>
          </Link>
        </div>
        <div>
          <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={(e) => this.handleMenu(e)}
              color="inherit"
          >
            {loggedIn ? <AccountCircle/> : <PersonAddRoundedIcon/>}
          </IconButton>
          <Menu
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
            {loggedIn ?
              <ListWrapper>
                <MenuItem onClick={() => this.handleClose()}>
                  <Link route="profile">
                    <p>Profile</p>
                  </Link>
                </MenuItem>
                <MenuItem onClick={() => this.handleLogout()}>Logout</MenuItem>
              </ListWrapper>
              :
              <ListWrapper>
                <MenuItem onClick={() => this.handleClose()}>
                  <Link route="login">
                    <p>Login</p>
                  </Link>
                </MenuItem>
                <MenuItem onClick={() => this.handleClose()}>
                  <Link route="signup">
                    <p>SignUp</p>
                  </Link>
                </MenuItem>
              </ListWrapper>
            }
          </Menu>
        </div>
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
          h1:hover{
            cursor: pointer;
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
