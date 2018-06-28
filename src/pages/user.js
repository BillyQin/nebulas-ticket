import React, { Component } from 'react';
import Header from '../components/header';
import { Link } from 'react-router-dom';
import { myNeb, contactAddr, callOptions } from '../utils/neb';
import Footer from '../components/footer';
import './user.less';

class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      address: '未检测到钱包插件',
      lists: [],
      term: ''
    }
  }

  async componentWillMount () {
    const address = localStorage.getItem('address')
    if (address) {
      this.setState({address})
      this.getAccountInfo(address)
      this.getUserHistory(address)
      this.getTerm()
    }
  }

  getUserHistory = (addr) => {
    let options = Object.assign({}, callOptions, {
      from: addr,
      contract: {
        function: "getTicketInfo",
        args: "[]"
      }
    })
    myNeb.api.call(options).then((res) => {
      this.setState({lists: JSON.parse(res.result)})
    });
  }

  getTerm = () => {
    let options = Object.assign({}, callOptions, {
      contract: {
        function: "getTerm",
        args: "[]"
      }
    })
    myNeb.api.call(options).then((res) => {
      console.log(JSON.parse(res.result))
    });
  }

  getAccountInfo = (address) => {
    myNeb.api.getAccountState(address).then(res => {
      this.setState({balance: res.balance/Math.pow(10,18)})
    }).catch((err) => {
        console.log(err);
    });
  }

  getLevel = (level) => {
    switch (level) {
      case 0: return '未中奖';
      case 1: return '一等奖';
      case 2: return '二等奖';
      case 3: return '三等奖';
      case 4: return '四等奖';
      case 5: return '五等奖';
      case 6: return '六等奖';
      default: return '未开奖'
    }
  }

  render() {
    return (
      <div className="user">
        <Header extends={
          <img className="header-img" onClick={()=>this.props.history.goBack()} src={require('../assets/images/back.png')}/>
        } />
        <div className="user-in-title">
          <p className="addr">{this.state.address}</p>
          <p className="user">余额：{this.state.balance} NAS</p>
        </div>
        <div>
          { this.state.lists.length ?
            <div>{this.state.lists.map((item, key) => (
              <div key={key} className="list-item">
                {item.white.map((ball,key)=>(
                  <div className={`ball`} key={key}>{ball}</div>
                ))}
                <div className={`ball blue`}>{item.blue[0]}</div>
                <div className="num">{parseFloat(item.num*0.1).toFixed(1)}</div>
                <div>{this.getLevel(item.level)}</div>
              </div>
            ))}</div>:
          <div className="none-info">
            <p>暂无投注信息</p>
            <Link to="/shop" className="base-btn">前往投注</Link>
          </div>
        }
        </div>
        <Footer/>
      </div>
    )
  }
}

export default User
