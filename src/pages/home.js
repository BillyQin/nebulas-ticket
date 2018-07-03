import React, { Component } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import { Toast } from 'antd-mobile';
import { randomNum, countDownTime, transTime } from '../utils/util';
import { myNebPay, myNeb, options, contactAddr, callOptions, funcIntervalQuery, listenerFunction } from '../utils/neb'
import './home.less';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ballLists: [],
      num: 1,
      balance: 0,
      time: 0,
      countDownShowTime: ``
    },
    this.countDown = null
  }

  componentWillMount () {
    this.getRandomNum()
    this.getContactValue()
    this.getTime()
    this.countDown = setInterval(() => {
      this.setState({countDownShowTime: countDownTime(this.state.time)})
    }, 1000)
  }

  componentWillUnmount () {
    clearInterval(this.countDown)
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
      console.log('time',time)
      this.setState({time})
    });
  }

  submit = () => {
    const totalPrice = this.state.num * 0.1
    let option = Object.assign({}, options, {listener: listenerFunction})
    const serialNumber = myNebPay.call(contactAddr, totalPrice, 'buyTicket', JSON.stringify([this.state.ballLists]), option)
    Toast.loading('Waiting to be confirm...', 60, null);
    let intervalQuery = setInterval(() => {
      funcIntervalQuery(intervalQuery, serialNumber)
    }, 10000);
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
              <p>{this.state.countDownShowTime}</p>
              <p className="unit">
                <span>Hr</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>Min</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>Sec</span>
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
