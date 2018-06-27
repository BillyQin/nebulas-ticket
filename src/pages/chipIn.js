import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/footer';
import Header from '../components/header';
import './chipIn.less';

import NebPay from 'nebpay';
const myNebPay = new NebPay();
class Buy extends Component {

  constructor(props) {
    super(props);
    this.state = {
      whiteBall: [],
      blueBall: [],
    }
  }

  generaNum = (num) => {
    let res = []
    for (let i = 1; i <= num; i++) {
      res.push(i<10 ? `0${i}`: i.toString())
    }
    return res
  }

  getWhiteBall = (num) => {
    const lists = this.state.whiteBall;
    if (lists.length < 6 && !lists.includes(num)) {
      lists.push(num)
    } else if (lists.includes(num)) {
      lists.splice(lists.indexOf(num), 1)
    }
    this.setState({whiteBall: lists})
  }

  getBlueBall = (num) => {
    const lists = this.state.blueBall;
    if (lists.length < 1 && !lists.includes(num)) {
      lists.push(num)
    } else if (lists.includes(num)) {
      lists.splice(lists.indexOf(num), 1)
    }
    this.setState({blueBall: lists})
  }

  randomBall = (type='whiteBall') => {
    let digit = type === 'whiteBall' ? 6 : 1
    let total = type === 'whiteBall' ? 28 : 14
    let result = []
    while(result.length < digit) {
      var rand = parseInt((Math.random()*total)+1);
      rand = rand<10 ? `0${rand}`: rand.toString()
      if (result.indexOf(rand) < 0) {
        result.push(rand)
      }
    }
    this.setState({[type]: result})
  }

  submit = () => {

    this.props.history.push('/shop')
  }

  render() {
    return (
      <div className="chipIn">
        <Header extends={
          <img onClick={()=>this.props.history.goBack()} src={require('../assets/images/back.png')} />
        }/>
        <div className="chip-in-title">
          <div className="left">
            <span className="name">White</span>
            <span>{this.state.whiteBall.length}/6</span>
          </div>
          <div onClick={()=> {this.randomBall('whiteBall')}} className="button">随机选</div>
        </div>
        <div className="nums">
        {
          this.generaNum(28).map((item,key) => (
            <div className={`ball ${this.state.whiteBall.includes(item)? 'orange' : ''}`} key={key}
            onClick={() => {this.getWhiteBall(item)}}>
              {item}
            </div>
          ))
        }
        </div>
        <div className="chip-in-title">
          <div className="left">
            <span className="name">Blue</span>
            <span>{this.state.blueBall.length}/1</span>
          </div>
          <div onClick={()=> {this.randomBall('blueBall')}}  className="button">随机选</div>
        </div>
        <div className="nums dark">
        {
          this.generaNum(14).map((item,key) => (
            <div className={`ball ${this.state.blueBall.includes(item)? 'blue' : ''}`} key={key}
            onClick={() => {this.getBlueBall(item)}}>
              {item}
            </div>
          ))
        }
        </div>
        <div className="confirm">
          <div>
            <img src={require('../assets/images/ticket.png')} />
          </div>
          <button disabled={this.state.whiteBall.length !== 6 || this.state.blueBall.length !== 1}
          className="btn" onClick={()=>{this.submit()}}>
            确认
          </button>
        </div>
        {/* <Footer /> */}
      </div>
    )
  }
}

export default Buy
