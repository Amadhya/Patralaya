import React from 'react';

import Feed from "./feed";
const Home = ({loggedIn}) => {
  return (
    <div>
      <Feed loggedIn={loggedIn}/>
    </div>
  );
};

export default Home;
