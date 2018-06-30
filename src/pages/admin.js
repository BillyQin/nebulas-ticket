import React, { Component } from 'react';
import Header from '../components/header';
import NebPay from 'nebpay';
import { myNeb, contactAddr, callOptions, options } from '../utils/neb';
import './admin.less';

const myNebPay = new NebPay();

export default class AdminPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      term: 0,
      money: 0,
      address: ''
    }
  }

  componentWillMount () {
    this.getTerm()
  }

  getTerm = () => {
    let options = Object.assign({}, callOptions, {
      contract: {
        function: "getTerm",
        args: "[]"
      }
    })
    myNeb.api.call(options).then((res) => {
      const term = JSON.parse(res.result)
      console.log(term)
      this.setState({term})
    });
  }

  open = () => {
    let txHash = myNebPay.call(contactAddr, 0, 'openLottery', JSON.stringify([]), options)
    console.log(txHash)
  }

  getMoney = () => {
    let txHash = myNebPay.call(contactAddr, 0, 'takeOut', JSON.stringify([this.state.money]), options)
    console.log('queryPayInfo', txHash)
  }

  setAdmin = () => {
    let txHash = myNebPay.call(contactAddr, 0, 'changeAdmin', JSON.stringify([this.state.address]), options)
    console.log('queryPayInfo', txHash)
  }

  setTime = () => {
    let txHash = myNebPay.call(contactAddr, 0, 'setTime', JSON.stringify([this.state.time]), options)
    console.log('12212', txHash)
    myNebPay.queryPayInfo(txHash).then(function (resp) {
      console.log('`11`1122:',resp);
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  render() {
    return (
      <div className="admin">
        <Header />
        <div className="box">
          <div className="item">
            <p>第{this.state.term}期</p>
            <button onClick={()=>{this.open()}} className="base-btn">开奖</button>
          </div>
          <div className="item">
            <p>设置开奖时间周期</p>
            <div>
              <input onChange={(e)=>{this.setState({time: e.target.value})}}/>
              <span>毫秒</span>
            </div>
            <button onClick={()=> {this.setTime()}} className="base-btn">确定</button>
          </div>
          <div className="item">
            <p>取钱</p>
            <div>
              <input onChange={(e)=>{this.setState({money: e.target.value})}}/>
              <span>Nas</span>
            </div>
            <button onClick={()=> {this.getMoney()}} className="base-btn">确定</button>
          </div>
          <div className="item">
            <p>修改admin address</p>
            <input onChange={(e)=>{this.setState({address: e.target.value})}}/>
            <button onClick={()=> {this.setAdmin()}} className="base-btn">确定</button>
          </div>
        </div>
      </div>
    )
  }
}

