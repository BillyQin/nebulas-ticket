import React, { Component } from 'react'
import { Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/home';
import ChipIn from './pages/chipIn';
import Shop from './pages/shop';
import Admin from './pages/admin';
import User from './pages/user';
import Record from './pages/record';

class Routes extends Component {

  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Home}/>
          <Route exact path="/shop" component={Shop}/>
          <Route exact path="/chipIn" component={ChipIn}/>
          <Route exact path="/user" component={User}/>
          <Route exact path="/record" component={Record}/>
          <Route exact path="/there-is-no-royal-road-to-learning" component={Admin}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default Routes
