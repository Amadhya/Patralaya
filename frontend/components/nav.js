import React from 'react';
import {
  IconButton, MenuItem, Menu, SwipeableDrawer, List, Divider, ListItem, ListItemIcon, ListItemText, Typography, Button
} from "@material-ui/core";
import AccountCircle from '@material-ui/icons/AccountCircle';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import EditIcon from '@material-ui/icons/Edit';
import PollIcon from '@material-ui/icons/Poll';
import MovieIcon from '@material-ui/icons/Movie';
import AndroidIcon from '@material-ui/icons/Android';
import RestaurantRoundedIcon from '@material-ui/icons/RestaurantRounded';
import GradeIcon from '@material-ui/icons/Grade';
import BubbleChartRoundedIcon from '@material-ui/icons/BubbleChartRounded';
import DehazeIcon from '@material-ui/icons/Dehaze';
import styled from 'styled-components';
import cookie from 'js-cookie';

import {ButtonLayout} from "./button";
import {Link, Router} from "../routes";
import Auth from "../pages/auth";


const ListWrapper = styled.div`
  display: block;
`;
const NavWrapper = styled.div`
  margin: 0 2rem;
`;
const SlideNavBarWrapper = styled.div`
  &:hover {
    cursor: pointer;
  }
`;
const ButtonWrapper = styled(Button)`
  @media(min-width: 767px){
    margin-right: 1.5rem !important;
  }
`; 
const MenuWrapper = styled(Menu)`
  margin-top: 2rem;
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
      anchorEl: null,
      left: false,
      popUpWindow: false,
    };
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

  handleFilterClick = (filter) => {
    Router.pushRoute('blog_feed', {filter: filter})
  };

  handleProfileClick = (id) => {
    this.handleClose();
  };

  handleSettingsClick = () => {
    this.handleClose();
    Router.pushRoute('settings');
  };

  handleWriteClick = () => {
    const {loggedIn} = this.props;

    if(loggedIn)
      Router.pushRoute('write_blog');
    else
      this.setState({
        popUpWindow: true,
      });
  };

  handleGetStarted = () => {
    this.setState({
      popUpWindow: true,
    });
  };

  handleClosePopUpWindow = () => {
    this.setState({
      popUpWindow: false,
    });
  };

  render() {
    const {anchorEl, popUpWindow} = this.state;
    const {loggedIn} = this.props;

    console.log(loggedIn, cookie.get('token'), 'in nav---');
    
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
                <ListItem button key={obj.title} onClick={() => this.handleFilterClick(obj.title)}>
                  <ListItemIcon><obj.icon/></ListItemIcon>
                  <ListItemText primary={obj.title} />
                </ListItem>
            ))}
          </List>
        </NavWrapper>
    );

    return(
      <nav>
        <SlideNavBarWrapper>
          <DehazeIcon onClick={toggleDrawer('left', true)}/>
          <SwipeableDrawer
              open={this.state.left}
              onClose={toggleDrawer('left', false)}
              onOpen={toggleDrawer('left', true)}
          >
            {sideList('left')}
          </SwipeableDrawer>
        </SlideNavBarWrapper>
        <div>
          <Link route="blog_feed">
            <h1>
              Patralaya
            </h1>
          </Link>
        </div>
        <div>
          <ButtonWrapper onClick={() => this.handleWriteClick()}>Write</ButtonWrapper>
          {loggedIn ? (
            <div>
              <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={(e) => this.handleMenu(e)}
                  color="inherit"
              >
                <AccountCircle/>
              </IconButton>
              <MenuWrapper
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
                <ListWrapper>
                  <MenuItem onClick={() => this.handleProfileClick()}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => this.handleSettingsClick()}>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={() => this.handleLogout()}>
                    Logout
                  </MenuItem>
                </ListWrapper>
              </MenuWrapper>
            </div>
          ):(
            <ButtonLayout variant="outlined" onClick={() => this.handleGetStarted()}>Get Started</ButtonLayout>
          )}
          <Auth open={popUpWindow} handleClose={(e) => this.handleClosePopUpWindow()}/>
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
            box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.05);
            margin-bottom: 3rem;
            position: fixed;
            width: 100%;
            background: white;
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

export default Nav;
