import React, { Component } from 'react';
import Header from '../components/header';
import { Link } from 'react-router-dom';
import { myNeb, myNebPay, contactAddr, options, callOptions, funcIntervalQuery, listenerFunction } from '../utils/neb';
import Footer from '../components/footer';
import { Toast } from 'antd-mobile';
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
    const address = localStorage.getItem('address') || ''
    if (address) {
      Toast.loading('Get data from Nebulas...', 15, null);
      this.setState({address})
      await this.getAccountInfo(address)
      if (localStorage.getItem('userRecord')) {
        this.setState({form: JSON.parse(localStorage.getItem('userRecord'))})
        Toast.hide()
      }
      this.getUserHistory(address)
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
      if (res) {
        let lists = JSON.parse(res.result)
        let form = {}
        lists.length && lists.map((item,key) => {
          if (!(item.term in form)) {
            form[item.term] = []
          }
          form[item.term].push(item)
        })
        localStorage.setItem('userRecord', JSON.stringify(form))
        Toast.hide()
        this.setState({form})
      }
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
      case 0: return 'Losing';
      case 1: return 'Grand Prize';
      case 2: return '1500 Nas';
      case 3: return '100 Nas';
      case 4: return '5 Nas';
      case 5: return '0.5 Nas';
      case 6: return '0.2 Nas';
      case 7: return 'Receive';
      default: return 'Waiting open'
    }
  }

  getMoney = () => {
    let option = Object.assign({}, options, {listener: listenerFunction})
    let serialNumber = myNebPay.call(contactAddr, 0, 'userTakeOut', JSON.stringify([]), option)
    Toast.loading('Waiting to be confirm...', 60, null);
    let intervalQuery = setInterval(() => {
      funcIntervalQuery(intervalQuery, serialNumber)
    }, 10000);
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
