import React, { Component } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import { randomNum, countDownTime, transTime } from '../utils/util';
import { myNebPay, myNeb, options, contactAddr, callOptions } from '../utils/neb'
import './home.less';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ballLists: [],
      num: 1,
      balance: 0,
      time: 0
    }
  }

  componentWillMount () {
    this.getRandomNum()
    this.getContactValue()
    this.getTime()
  }

  getRandomNum = () => {
    let ballLists = []
    ballLists = ballLists.concat(randomNum())
    this.setState({ballLists})
  }

  getContactValue = () => {
    myNeb.api.getAccountState(contactAddr).then(res => {
      const balance = res.balance/Math.pow(10,18)
      localStorage.setItem('contactBalance', balance)
      this.setState({balance})
    }).catch((err) => {
      console.log(err);
    });
  }

  getTime = () => {
    let options = Object.assign({}, callOptions, {
      contract: {
        function: "getTime",
        args: "[]"
      }
    })
    myNeb.api.call(options).then((res) => {
      let time = JSON.parse(res.result)
      localStorage.setItem('contactTime', time)
      this.setState({time})
    });
  }

  submit = () => {
    const totalPrice = this.state.num * 0.1
    const txHash = myNebPay.call(contactAddr, totalPrice, 'buyTicket', JSON.stringify([this.state.ballLists]), options)
    console.log(txHash)
  }

  render() {
    return (
      <div className="home">
        <Header />
        <div className="banner">
          <h1>Super DreamBall Lotto</h1>
          <p className="sub">One Ticket One Dream!</p>
          <p className="intro">The most open and fair lottery ticket in the world.</p>
          <p className="intro">70% of the world's highest return rate.</p>
        </div>
        <main>
          <div className="lists">
            <div className="price">
              <p className="part-title time">Next Drawing-{transTime(this.state.time)}</p>
              <p className="part-title">Estimated Jackpot</p>
              <span>{parseFloat(1500 + parseFloat(this.state.balance))} Nas</span>
            </div>
            <div className="count-down-box">
              <span>Countdown to Drawing</span>
              <p>{countDownTime(this.state.time)}</p>
              <p className="unit">
                <span>Day</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>Hr</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>Min</span>
              </p>
            </div>
            <p className="part-title">Lucky Numbers</p>
            {
              this.state.ballLists.length &&
              this.state.ballLists.map((item,key) => (
                <div className="list-item" key={key}>
                  {item.white.map((item,key)=>(
                    <div className={`ball`} key={key}>{item}</div>
                  ))}
                  <div className={`ball blue`}>{item.blue[0]}</div>
                </div>
              ))
            }
            <div className="btn-group">
              <img src={require('../assets/images/xx.png')} />
              <input type="number" onChange={(e) => {this.setState({num: e.target.value})}} defaultValue={this.state.num} />
              <div onClick={()=>this.submit()} className="base-btn">quick pick</div>
            </div>
          </div>
        </main>
        <Footer pathName='/'/>
      </div>
    )
  }
}

export default Home
