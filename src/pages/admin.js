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
      term: 0
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

  setTime = () => {
    let txHash = myNebPay.call(contactAddr, 0, 'setTime', JSON.stringify([this.state.time]), options)
    console.log(txHash)
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
        </div>
      </div>
    )
  }
}

