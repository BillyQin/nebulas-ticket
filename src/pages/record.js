import React, { Component } from 'react';
import Header from '../components/header';
import { myNeb, contactAddr } from '../utils/neb';
import Footer from '../components/footer';
import './record.less';

class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      address: '未检测到钱包插件',
      lists: []
    }
  }

  componentWillMount () {
    const address = localStorage.getItem('address')
    if (address) {
      this.setState({address})
      // this.getAccountInfo(address)
      this.getLottery(address)
    }
  }

  getLottery = (addr) => {
    myNeb.api.call({
      chainID: 1,
      from: addr,
      to: contactAddr,
      value: 0,
      nonce: 12,
      gasPrice: 1000000,
      gasLimit: 2000000,
      contract: {
          function: "getLottery",
          args: "[]"
      }
    }).then((res) => {
      console.log('11111111',res.result)
      this.setState({lists: JSON.parse(res.result)})
    });
  }

  render() {
    return (
      <div className="record">
        <Header extends={
          <img className="header-img" onClick={()=>this.props.history.goBack()} src={require('../assets/images/back.png')}/>
        } />
        <div className="record-in-title">
          <p className="">？</p>
          <p className="user">开奖公告</p>
          <p></p>
        </div>
        <div>
          { this.state.lists.length &&
            this.state.lists.map((item, key) => (
            <div key={key} className="list-item">
              <p className="title">第{item.term}期</p>
              <div className="ballLists">
                {item.white.map((item,key)=>(
                  <div className={`ball`} key={key}>{item}</div>
                ))}
                <div className={`ball blue`}>{item.blue[0]}</div>
              </div>
            </div>
          ))}
        </div>
        <Footer/>
      </div>
    )
  }
}

export default User
