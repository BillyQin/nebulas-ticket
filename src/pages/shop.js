import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import './shop.less';
import { myNebPay, options, contactAddr } from '../utils/neb'
import { randomNum } from '../utils/util';

class Buy extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ballLists: [],
      totalNums: 0,
      num: 5
    }
  }

  componentWillMount() {
    const newBall = this.props.location.state || ''
    const lists = JSON.parse(localStorage.getItem('chipIn')) || []
    this.state.ballLists = this.state.ballLists.concat(lists)
    if (newBall) {
      this.state.ballLists.push({white: newBall.white, blue: newBall.blue, num: 5})
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
    let txHash = myNebPay.call(contactAddr, this.state.totalNums*0.1, 'buyTicket', JSON.stringify([this.state.ballLists]), options)
    console.log(txHash)
  }

  render() {
    return (
      <div className="shop">
        <Header extends={
          <img className="header-img" onClick={()=>this.props.history.goBack()} src={require('../assets/images/back.png')}/>
        } />
        <div className="shop-in-title">
          <p>头奖: 100nas</p>
          <p>距离下期开奖还有：xx-xx-xx</p>
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
            <div onClick={()=>this.goChipIn()} className="base-btn">选号</div>
            <div onClick={()=>this.getRandomNum()} className="base-btn">快速选号</div>
          </div>
        </div>
        <div className="confirm">
          <div className="total-price">
            <p>总计：{this.state.totalNums}注 {}NAS</p>
          </div>
          <div className="btn" onClick={()=>{this.submit()}}>购买</div>
        </div>
        <Footer pathName='/shop'/>
      </div>
    )
  }
}

export default Buy
