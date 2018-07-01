import React, { Component } from 'react';
import Header from '../components/header';
import { Link } from 'react-router-dom';
import { myNeb, myNebPay, contactAddr, options, callOptions } from '../utils/neb';
import Footer from '../components/footer';
import './user.less';

class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      address: '',
      form: [],
      term: ''
    }
  }

  async componentWillMount () {
    const address = localStorage.getItem('address')
    if (address) {
      this.setState({address})
      await this.getAccountInfo(address)
      this.getUserHistory(address)
      // this.getTerm()
    }
  }

  getUserHistory = (addr) => {
    let nonce = localStorage.getItem('nonce') || 1
    let options = Object.assign({}, callOptions, {
      from: addr,
      nonce,
      contract: {
        function: "getTicketInfo",
        args: ""
      }
    })
    myNeb.api.call(options).then((res) => {
      let lists = JSON.parse(res.result)
      let form = {}
      lists.length && lists.map((item,key) => {
        if (!(item.term in form)) {
          form[item.term] = []
        }
        form[item.term].push(item)
      })
      this.setState({form})
    });
  }

  getAccountInfo = (address) => {
    myNeb.api.getAccountState(address).then(res => {
      this.setState({balance: res.balance/Math.pow(10,18)})
      localStorage.setItem('nonce', res.nonce)
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
      case 7: return '已领奖';
      default: return '未开奖'
    }
  }

  getMoney = () => {
    let txHash = myNebPay.call(contactAddr, 0, 'userTakeOut', JSON.stringify([]), options)
    console.log(txHash)

  }

  render() {
    return (
      <div className="user">
        <Header extends={
          <img className="header-img" onClick={()=>this.props.history.goBack()} src={require('../assets/images/back.png')}/>
        } />
        <div className="user-in-title">
          <p className="addr">{this.state.address}</p>
          <div className="balance">
            <p className="">Balance: {this.state.balance} NAS</p>
            <div onClick={()=>this.getMoney()} className="base-btn">Take the prize</div>
          </div>
        </div>
        <div className="lists">
          { Object.keys(this.state.form).length ?
            <div>
              {Object.keys(this.state.form).reverse().map((term, key) => (
                <div>
                  <p>No.{term}</p>
                  {this.state.form[term].map((item, key) => (
                    <div key={key} className="list-item">
                      {item.white.map((ball,key)=>(
                        <div className={`ball`} key={key}>{ball}</div>
                      ))}
                      <div className={`ball blue`}>{item.blue[0]}</div>
                      <div className="num">{parseFloat(item.num*0.1).toFixed(1)}</div>
                      <div>{this.getLevel(item.level)}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>:
            <div className="none-info">
              <p>Not available</p>
              <Link to="/shop" className="base-btn">Go pick</Link>
            </div>
          }
        </div>
        <Footer pathName='/user'/>
      </div>
    )
  }
}

export default User
