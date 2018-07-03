import React, { Component } from 'react';
import Header from '../components/header';
import { myNeb, contactAddr } from '../utils/neb';
import Footer from '../components/footer';
import { Toast } from 'antd-mobile';
import './record.less';

class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      address: '',
      lists: []
    }
  }

  componentWillMount () {
    const address = localStorage.getItem('address')
    if (address) {
      Toast.loading('Get data from Nebulas...', 15, null, false);
      if (localStorage.getItem('recordHistory')) {
        Toast.hide()
        this.setState({lists: JSON.parse(localStorage.getItem('recordHistory')),address})
      }
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
      if (res) {
        Toast.hide()
        localStorage.setItem('recordHistory', res.result)
        this.setState({lists: JSON.parse(res.result),address: addr})
      }
    });
  }

  componentWillUnmount () {
    Toast.hide()
  }

  render() {
    return (
      <div className="record">
        <Header extends={
          <img className="header-img" onClick={()=>this.props.history.goBack()} src={require('../assets/images/back.png')}/>
        } />
        <div className="record-in-title">
          <p className="">？</p>
          <p className="title">Winning Numbers</p>
          <p></p>
        </div>
        <div className="list">
          { this.state.lists.length > 0 ?
            <div>
              {
              this.state.lists.map((item, key) => (
              <div key={key} className="list-item">
                <p className="title">No.{item.term}</p>
                <div className="ballLists">
                  {item.white.map((item,key)=>(
                    <div className={`ball`} key={key}>{item}</div>
                  ))}
                  <div className={`ball blue`}>{item.blue[0]}</div>
                </div>
              </div>))
              }
            </div>:
            <div className="none-info">
              <p>Not available</p>
            </div>
          }
          </div>
        <Footer pathName='/record'/>
      </div>
    )
  }
}

export default User
