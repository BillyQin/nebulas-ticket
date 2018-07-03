import React, { Component } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { Toast } from 'antd-mobile';
import './shop.less';
import { myNebPay, options, contactAddr, listenerFunction, funcIntervalQuery } from '../utils/neb'
import { randomNum, countDownTime } from '../utils/util';

class Buy extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ballLists: [],
      totalNums: 0,
      num: 1,
      contactBalance: JSON.parse(localStorage.getItem('contactBalance')) || 0,
      contactTime: JSON.parse(localStorage.getItem('contactTime')) || 0
    }
  }

  componentWillMount() {
    const newBall = this.props.location.state || ''
    const lists = JSON.parse(localStorage.getItem('chipIn')) || []
    this.state.ballLists = this.state.ballLists.concat(lists)
    if (newBall) {
      this.state.ballLists.push({white: newBall.white, blue: newBall.blue, num: 1})
    }
    this.updateBallLists(this.state.ballLists)
  }

  getRandomNum = () => {
    let ballLists = this.state.ballLists
    ballLists = ballLists.concat(randomNum())
    this.updateBallLists(ballLists)
  }

  removeLists = (key) => {
    let ballLists = this.state.ballLists
    ballLists.splice(key, 1)
    this.updateBallLists(ballLists)
  }

  _changeValue = (value, key) => {
    let ballLists = this.state.ballLists
    ballLists[key].num = value
    this.updateBallLists(ballLists)
  }

  _changeNum = (value) => {
    this.updateBallLists(this.state.ballLists, value)
  }

  updateBallLists = (ballLists, value=this.state.num) => {
    let totalNums = 0
    if (ballLists.length) {
      ballLists.map((item) => {
        totalNums += (parseInt(item.num) || 0) * (parseInt(value) || 0)
      })
    }
    this.setState({ballLists, totalNums: parseInt(totalNums), num: value})
  }

  goChipIn = () => {
    localStorage.setItem('chipIn', JSON.stringify(this.state.ballLists))
    this.props.history.push('/chipIn')
  }

  submit = () => {
    let lists = this.state.ballLists
    lists.map(item => {
      item.num = item.num*(this.state.num || 0)
    })

    let option = Object.assign({}, options, {listener: listenerFunction})

    let serialNumber = myNebPay.call(contactAddr, parseFloat(this.state.totalNums*0.1).toFixed(1), 'buyTicket', JSON.stringify([lists]), option)
    console.log(serialNumber)
    Toast.loading('Waiting to be confirm...', 60, null);
    let intervalQuery = setInterval(() => {
      funcIntervalQuery(intervalQuery, serialNumber)
    }, 10000);
    localStorage.removeItem('chipIn')
  }

  render() {
    return (
      <div className="shop">
        <Header extends={
          <img className="header-img" onClick={()=>this.props.history.goBack()} src={require('../assets/images/back.png')}/>
        } />
        <div className="shop-in-title">
          <p className="top">{`Jackpot：${this.state.contactBalance} NAS`}</p>
          <p className="bottom">{`Countdown to Drawing: ${countDownTime(this.state.contactTime)}`}</p>
        </div>
        <div className="nums">
          <div className="lists">
          {
            this.state.ballLists.length > 0 &&
            this.state.ballLists.map((item,key) => (
              <div className="list-item" key={key}>
                {item.white.map((item,key)=>(
                  <div className={`ball`} key={key}>{item}</div>
                ))}
                <div className={`ball blue`}>{item.blue[0]}</div>
                <input type="number" onChange={(e)=>{this._changeValue(e.target.value, key)}} defaultValue={item.num} />
                <img onClick={()=>this.removeLists(key)} src={require('../assets/images/xx.png')} />
              </div>
            ))
          }
          </div>
          <div className="btn-box">
            <div className="price">
              <img src={require('../assets/images/xx.png')} />
              <input type="number" onChange={(e) => {this._changeNum(e.target.value)}} defaultValue={this.state.num} />
            </div>
            <div onClick={()=>this.goChipIn()} className="base-btn">pick</div>
            <div onClick={()=>this.getRandomNum()} className="base-btn">quick pick</div>
          </div>
        </div>
        <div className="confirm">
          <div className="total-price">
            <p>total：{this.state.totalNums} tickets</p>
          </div>
          <p className="amount">{parseFloat(this.state.totalNums*0.1).toFixed(1)}Nas</p>
          <div className="btn" onClick={()=>{this.submit()}}>Buy</div>
        </div>
        <Footer pathName='/shop'/>
      </div>
    )
  }
}

export default Buy
