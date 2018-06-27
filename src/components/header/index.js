import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.less';

class Header extends Component {

  constructor (props) {
    super(props);
  }

  render() {
    return (
      <div className="header">
        <div className="left">
          {/* <Icon type="left" style={{ fontSize: 14, color: '#233846' }} /> */}
        </div>
        <div className="center">
          <img src={require('../../assets/images/logo.png')} />
        </div>
        <div className="right">
          {this.props.extends}
        </div>
      </div>
    );
  }
}

export default Header
