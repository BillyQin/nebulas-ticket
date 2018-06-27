import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/footer';
import Header from '../components/header';
// import { Progress } from 'antd-mobile';
// import { candyList } from '../config/mobileApi';
// import './index.less';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLists: false,
      modal: false
    }
    this.lists = []
    this.timeOut = null
    this.page = 1
    this.loading = false
    this.loadMore = null
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

export default Home
