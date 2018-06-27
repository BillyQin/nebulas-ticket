import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/footer';
import Header from '../components/header';
import { userInfo } from 'os';
// import { Progress } from 'antd-mobile';
// import { candyList } from '../config/mobileApi';
// import './index.less';

class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLists: false,
      modal: false
    }
  }

  componentWillMount () {
    var address = this.getCookie('address')
    console.log(address)
  }

  getCookie = (name) => {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
  }

  render() {
    return (
      <div>
        <Header />
        <div>投注</div>
        <Footer />
      </div>
    )
  }
}

export default User
